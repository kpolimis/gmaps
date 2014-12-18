
# This module introduces slight modifications to IPython's nbconvert utility, namely:
# - overloading the base NbConvertApp to introduce a custom exporter.

import os
import sys 

from IPython.nbconvert.exporters.html import HTMLExporter
from IPython.nbconvert.nbconvertapp import *


class TreeExporter(HTMLExporter):

    def _path_to_basedir(self, filename):
        basedir = os.getcwd()+"/src"
        dirname = os.path.dirname(filename)
        return os.path.relpath(basedir, dirname)

    def from_filename(self, filename, resources=None, **kw):
        resources["path_to_basedir"] = self._path_to_basedir(filename)
        nb_copy, resources = super(TreeExporter, self).from_filename(filename, resources, **kw)
        return nb_copy, resources


class GMapsNbConvertApp(NbConvertApp):

    def convert_notebooks(self):
        """
        Convert the notebooks in the self.notebook traitlet

        This function is largely a clone of the function in the superclass,
        with the exception that the exporter is specified as TreeExporter.
        """
        # Export each notebook
        conversion_success = 0

        if self.output_base != '' and len(self.notebooks) > 1:
            self.log.error(
            """UsageError: --output flag or `NbConvertApp.output_base` config option
            cannot be used when converting multiple notebooks.
            """)
            self.exit(1)
        
        exporter = TreeExporter(config=self.config)

        for notebook_filename in self.notebooks:
            self.log.info("Converting notebook %s to %s", notebook_filename, self.export_format)

            # Get a unique key for the notebook and set it in the resources object.
            basename = os.path.basename(notebook_filename)
            notebook_name = basename[:basename.rfind('.')]
            if self.output_base:
                # strip duplicate extension from output_base, to avoid Basname.ext.ext
                if getattr(exporter, 'file_extension', False):
                    base, ext = os.path.splitext(self.output_base)
                    if ext == exporter.file_extension:
                        self.output_base = base
                notebook_name = self.output_base
            resources = {}
            resources['profile_dir'] = self.profile_dir.location
            resources['unique_key'] = notebook_name
            resources['output_files_dir'] = '%s_files' % notebook_name
            self.log.info("Support files will be in %s", os.path.join(resources['output_files_dir'], ''))

            # Try to export
            try:
                output, resources = exporter.from_filename(notebook_filename, resources=resources)
            except ConversionException as e:
                self.log.error("Error while converting '%s'", notebook_filename,
                      exc_info=True)
                self.exit(1)
            else:
                if 'output_suffix' in resources and not self.output_base:
                    notebook_name += resources['output_suffix']
                write_results = self.writer.write(output, resources, notebook_name=notebook_name)

                #Post-process if post processor has been defined.
                if hasattr(self, 'postprocessor') and self.postprocessor:
                    self.postprocessor(write_results)
                conversion_success += 1

        # If nothing was converted successfully, help the user.
        if conversion_success == 0:
            self.print_help()
            sys.exit(-1)
    

if __name__ == "__main__":
    GMapsNbConvertApp.launch_instance(argv=sys.argv[1:])
