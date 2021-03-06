import widgets from 'jupyter-js-widgets'
import _ from 'underscore'

import GoogleMapsLoader from 'google-maps'

function reloadGoogleMaps(configuration) {
    GoogleMapsLoader.release();
    GoogleMapsLoader.LIBRARIES = ["visualization"] ;
    if (configuration["api_key"] !== null &&
        configuration["api_key"] !== undefined) {
            GoogleMapsLoader.KEY = configuration["api_key"];
    };
}

reloadGoogleMaps({}) ;

function gPointToList(gpoint) {
    return [gpoint.lat(), gpoint.lng()]
}

function gBoundsToList(gbounds) {
    const sw = gPointToList(gbounds.getSouthWest())
    const ne = gPointToList(gbounds.getNorthEast())
    return [sw, ne]
}

// Mixins

const ConfigurationMixin = {
    loadConfiguration() {
        const modelConfiguration = this.model.get("configuration")
        reloadGoogleMaps(modelConfiguration)
    }
}


// Views

const GMapsLayerView = widgets.WidgetView.extend({
    initialize(parameters) {
        GMapsLayerView.__super__.initialize.apply(this, arguments)
        this.mapView = this.options.mapView
    }
})


export const DirectionsLayerView = GMapsLayerView.extend({
    render() {
        const rendererOptions = { map: this.mapView.map }

        this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

        const modelData = this.model.get("data");

        const request = {
            origin: this.getOrigin(modelData),
            destination: this.getDestination(modelData),
            waypoints: this.getWaypoints(modelData),
            travelMode: google.maps.TravelMode.DRIVING
        };

        const directionsService = new google.maps.DirectionsService();

        directionsService.route(request, (response, status) => {
            // print to the browser console (mostly for debugging)
            console.log(`Direction service returned: ${status}`) ;
            // set a flag in the model
            this.model.set("layer_status", status) ;
            this.touch() ; // push `layer_status` changes to the model
            if (status == google.maps.DirectionsStatus.OK) {
                this.response = this.directionsDisplay ;
                this.directionsDisplay.setDirections(response);
            }
        });
    },


    addToMapView(mapView) { },

    getOrigin(modelData) {
        const [lat, lng] = _.first(modelData)
        return new google.maps.LatLng(lat, lng)
    },

    getDestination(modelData) {
        const [lat, lng] = _.last(modelData)
        return new google.maps.LatLng(lat, lng)
    },

    getWaypoints(modelData) {
        const withoutFirst = _.tail(modelData)
        const withoutLast = _.initial(withoutFirst)
        const dataAsGoogle = withoutLast.map(([lat, lng]) => {
            return {location: new google.maps.LatLng(lat, lng)}
        })
        return dataAsGoogle
    }
})


const HeatmapLayerBaseView = GMapsLayerView.extend({
    render() {
        this.modelEvents() ;
        GoogleMapsLoader.load((google) => {
            this.heatmap = new google.maps.visualization.HeatmapLayer({
                data: this.getData(),
                radius: this.model.get("point_radius"),
                maxIntensity: this.model.get("max_intensity")
            }) ;
        });
    },

    addToMapView(mapView) {
        this.heatmap.setMap(mapView.map)
    },

    modelEvents() {
        this.model.on("change:point_radius", this.updateRadius, this)
        this.model.on("change:max_intensity", this.updateMaxIntensity, this)
    },

    get_data() {},

    updateRadius() {
        this.heatmap.set('radius', this.model.get('point_radius'));
    },

    updateMaxIntensity() {
        this.heatmap.set('maxIntensity', this.model.get('max_intensity'));
    }

})

export const SimpleHeatmapLayerView = HeatmapLayerBaseView.extend({
    getData() {
        const data = this.model.get("data")
        const dataAsGoogle = new google.maps.MVCArray(
            data.map(([lat, lng]) => new google.maps.LatLng(lat, lng))
        )
        return dataAsGoogle
    }
});


export const WeightedHeatmapLayerView = HeatmapLayerBaseView.extend({
    getData() {
        const data = this.model.get("data");
        const dataAsGoogle = new google.maps.MVCArray(
            data.map(([lat, lng, weight]) => {
                const location = new google.maps.LatLng(lat, lng)
                return { location: location, weight: weight }
            })
        );
        return dataAsGoogle
    }
})


export const PlainmapView = widgets.DOMWidgetView.extend({
    render() {
        this.loadConfiguration();
        this.el.style["width"] = this.model.get("width");
        this.el.style["height"] = this.model.get("height");

        const initialBounds = this.model.get("data_bounds");

        this.layerViews = new widgets.ViewList(this.addLayerModel, null, this);
        this.modelEvents() ;

        this.on("displayed", () => {
            GoogleMapsLoader.load((google) => {
                this.map = new google.maps.Map(this.el) ;
                this.updateBounds(initialBounds);

                this.layerViews.update(this.model.get("layers"));

                // hack to force the map to redraw
                setTimeout(() => {
                    google.maps.event.trigger(this.map, 'resize') ;
                }, 1000);
            })
        })
    },

    modelEvents() {
        this.model.on("change:data_bounds", this.updateBounds, this);
    },

    updateBounds() {
        const [[latBL, lngBL], [latTR, lngTR]] = this.model.get("data_bounds")
        const boundBL = new google.maps.LatLng(latBL, lngBL)
        const boundTR = new google.maps.LatLng(latTR, lngTR)
        const bounds = new google.maps.LatLngBounds(boundBL, boundTR)
        this.map.fitBounds(bounds);
    },

    addLayerModel(childModel) {
        return this.create_child_view(
            childModel, {mapView: this}
        ).then((childView) => {
            childView.addToMapView(this) ;
            return childView;
        })
    },

})

_.extend(PlainmapView.prototype, ConfigurationMixin);


// Models

export const GMapsLayerModel = widgets.WidgetModel.extend({
    defaults: _.extend({}, widgets.WidgetModel.prototype.defaults, {
        _view_name : 'GMapsLayerView',
        _model_name : 'GMapsLayerModel',
        _view_module : 'jupyter-gmaps',
        _model_module : 'jupyter-gmaps',
    })
});

export const DirectionsLayerModel = GMapsLayerModel.extend({
    defaults: _.extend({}, GMapsLayerModel.prototype.defaults, {
        _view_name: "DirectionsLayerView",
        _model_name: "DirectionsLayerModel"
    })
});

export const SimpleHeatmapLayerModel = GMapsLayerModel.extend({
    defaults: _.extend({}, GMapsLayerModel.prototype.defaults, {
        _view_name: "SimpleHeatmapLayerView",
        _model_name: "SimpleHeatmapLayerModel"
    })
});


export const WeightedHeatmapLayerModel = GMapsLayerModel.extend({
    defaults: _.extend({}, GMapsLayerModel.prototype.defaults, {
        _view_name: "WeightedHeatmapLayerView",
        _model_name: "WeightedHeatmapLayerModel"
    })
});


export const PlainmapModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend({}, widgets.DOMWidgetModel.prototype.defaults, {
        _view_name: "PlainmapView",
        _model_name: "PlainmapModel",
        _view_module : 'jupyter-gmaps',
        _model_module : 'jupyter-gmaps',
        width: "600px",
        height: "400px"

    })
}, {
    serializers: _.extend({
            layers: {deserialize: widgets.unpack_models}
    }, widgets.DOMWidgetModel.serializers)
});
