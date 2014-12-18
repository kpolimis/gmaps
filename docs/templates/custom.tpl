{%- extends 'basic.tpl' -%}
{% from 'mathjax.tpl' import mathjax %}


{%- block header -%}
<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8" />
<title>{{resources['metadata']['name']}}</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<script src="{{ resources['path_to_basedir'] }}/static/js/ipython.js"></script>

<script>
requirejs.config({
	baseUrl : "{{ resources['path_to_basedir'] }}",
	paths : {
		jquery : "//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min",
		underscore : "//underscorejs.org/underscore-min",
		backbone : "//backbonejs.org/backbone-min",
        widgets : "static/js/widgets",
        gmaps_views : "static/js/gmaps_views"
	}
})
</script>

{% for css in resources.inlining.css -%}
    <style type="text/css">
    {{ css }}
    </style>
{% endfor %}

<style type="text/css">
/* Overrides of notebook CSS for static HTML export */
body {
  overflow: visible;
  padding: 8px;
}

div#notebook {
  overflow: visible;
  border-top: none;
}

@media print {
  div.cell {
    display: block;
    page-break-inside: avoid;
  } 
  div.output_wrapper { 
    display: block;
    page-break-inside: avoid; 
  }
  div.output { 
    display: block;
    page-break-inside: avoid; 
  }
}
</style>

<!-- Loading mathjax macro -->
{{ mathjax() }}

</head>
{%- endblock header -%}

{% block body %}
<body>
  <div tabindex="-1" id="notebook" class="border-box-sizing">
    <div class="container" id="notebook-container">
{{ super() }}
    </div>
  </div>
</body>
{%- endblock body %}

{% block data_html scoped -%}
<div class="output_html rendered_html output_subarea {{extra_class}}">
{{ output.html }}
</div>
{%- endblock data_html %}

{% block footer %}
</html>
{% endblock footer %}
