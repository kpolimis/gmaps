
from IPython.nbconvert.preprocessors.base import Preprocessor

import jinja2

output_cell_template = jinja2.Template("""
<div id='cell-{{ cell_index }}'></div>
<script>
require(["{{ model_file_name }}"], function(model_module) {
    $(document).ready(function() { 
        model = new model_module.{{ model_name }}() ;
        model.initialize_view($("#cell-{{ cell_index }}")) ;
        model.view.render() ;
    }) ;
}) ;
</script>
""")

class SuppressOutputPreprocessor(Preprocessor):
    """
    Removes output of cells with { gmaps : { exclude_output : true } }
    in metadata.
    """

    def preprocess_cell(self, cell, resources, index):
        if "gmaps" in cell.metadata:
            if "exclude_output" in cell.metadata.gmaps and cell.metadata.gmaps.exclude_output:
                cell.outputs = []
        return cell, resources


class ModelInsertPreprocessor(Preprocessor):
    """
    Insert the model in this cell's output.

    If the gmaps section of the cell's metadata contains "contains_map_output",
    appends an HTML block to the output, rendering the specified map model.
    """

    def preprocess_cell(self, cell, resources, index):
        if "gmaps" in cell.metadata:
            if "contains_map_output" in cell.metadata.gmaps:
                model_file_name = cell.metadata.gmaps.model_file.rsplit(".")[0]
                model_name = cell.metadata.gmaps.model_name
                cell.outputs.append({"html":output_cell_template.render(cell_index=index, 
                    model_file_name=model_file_name, model_name=model_name), 
                    "output_type" : "display_data", "metadata" : {}})
        return cell, resources
