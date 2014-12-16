
conf = get_config()

conf.Exporter.preprocessors = [ "gmaps_preprocessors.SuppressOutputPreprocessor", 
    "gmaps_preprocessors.ModelInsertPreprocessor" ]
