
Getting started
---------------

`gmaps` is a plugin for Jupyter for embedding Google Maps in your notebooks. It is designed as a data visualization tool. It can currently only draw heatmaps.

To demonstrate `gmaps`, let's plot the earthquake dataset, included in the package::

  import gmaps
  import gmaps.datasets

  gmaps.configure(api_key="AI...") # Fill in with your API key

  earthquake_data = gmaps.datasets.load_dataset("earthquakes")

  print(earthquake_data[:4]) # first four rows

The earthquake data is a list of triples: a latitude and longitude indicating the earthquake's epicentre and a weight denoting the magnitude of the earthquake at that point. Let's plot the earthquakes on a Google map::

  m = gmaps.Map()
  m.add_layer(gmaps.WeightedHeatmap(data=earthquake_data))
  m

.. image:: tutorial-earthquakes.*

This gives you a fully-fledged Google map. You can zoom in and out, switch to satellite view and even to street view if you really want. The heatmap adjusts as you zoom in and out.


Basic concepts
^^^^^^^^^^^^^^

`gmaps` is built around the idea of adding layers to a base map. After you've `authenticated <authentication.html>`_ with Google maps, you start by creating a base map::

  import gmaps
  gmaps.configure(api_key="AI...")

  m = gmaps.Map()
  m

.. image:: plainmap2.*

You then add layers on top of the base map. For instance, to add a heatmap layer::

  import gmaps
  gmaps.configure(api_key="AI...")

  m = gmaps.Map()

  # generate some data
  data = [(51.5, 0.1), (51.7, 0.2), (51.4, -0.2), (51.49, 0.1)]

  heatmap_layer = gmaps.Heatmap(data=data)
  m.add_layer(heatmap_layer)
  m

.. image:: plainmap3.*

Attributes on the base map and the layers can be set through named arguments in the constructor or as instance attributes once the instance is created. These two constructions are thus equivalent::

  heatmap_layer = gmaps.Heatmap(data=data)
  heatmap_layer.point_radius = 8

and::

  heatmap_layer = gmaps.Heatmap(data=data, point_radius=8)

The former construction is useful for modifying a map once it has been built. Any change in parameters will propagate to maps in which those layers are included.

Heatmaps
^^^^^^^^

Heatmaps are a good way of getting a sense of the density and clusters of geographical events. They are a powerful tool for making sense of larger datasets. We will use a dataset recording all instances of political violence that occurred in Africa between 1997 and 2015. The dataset comes from the `Armed Conflict Location and Event Data Project <http://www.acleddata.com>`_. This dataset contains about 110,000 rows.::

  import gmaps.datasets

  data = gmaps.datasets.load_dataset("acled_africa.csv")
  print(rows[:10])

  # => prints latitude, longitude pairs
  [(36.4686, 2.8289),
  (36.6725, 2.7894),
  ...


We already know how to build a heatmap layer::

  import gmaps
  import gmaps.datasets
  gmaps.configure("AI...")

  m = gmaps.Map()
  heatmap_layer = gmaps.Heatmap(data=data)
  m.add_layer(heatmap_layer)
  m

If you zoom in sufficiently, you will notice that individual points disappear. You can prevent this from happening by controlling the ``max_intensity`` setting. This caps off the maximum peak intensity. It is useful if your data is strongly peaked. This settings is `None` by default, which implies no capping. Typically, when setting the maximum intensity, you also want to set the ``point_radius`` setting to a fairly low value. The only good way to find reasonable values for these settings is to tweak them until you have a map that you are happy with.::

  heatmap_layer.max_intensity = 100
  heatmap_layer.point_radius = 5

To avoid re-drawing the whole map every time you tweak these settings, you may want to set them in another noteobook cell:


.. image:: acled_africa_heatmap.png

Weighted heatmaps
^^^^^^^^^^^^^^^^^

Weighted heatmap layers are identical to heatmaps, except that the `data` object is a triple indicating `(latitude, longitude, weight)`. Weights must all be positive (this is a limitation in Google maps itself). 
