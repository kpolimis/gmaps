
Contributing
============

gmaps is a very new project, so there is a lot of scope for developers to make
a strong impact by contributing code, documentation and expertise. All
contributions are welcome.

How to contribute
-----------------

The `documentation <http://docs.scipy.org/doc/numpy/dev/gitwash/index.html>`_ for Numpy gives a detailed description of how to contribute. Most of this information applies to development for ``gmaps``.

Developing with git
^^^^^^^^^^^^^^^^^^^^

You will need the `Git version control system <http://git-scm.com>`_ and an account on `Github <https://github.com>`_ to
contribute to gmaps.

1. Fork the `project repository <http://github.com/pbugnion/gmaps>`_ by clicking `Fork` in the top right of the page. This will create a copy of the fork under your account on Github.

2. Clone the repository to your computer::
   
    $ git clone https://github.com/YourUserID/gmaps.git

3. Install gmaps by running::

    $ python setup.py install_data
    $ python setup.py develop

   in the package's root directory. Passing the ``develop`` argument to
   ``setup.py``, rather than ``install``, means that python files are 
   sym-linked to the relevant ``site-packages`` directory, rather than copied.
   That means that you don't have to re-install the package when you 
   make changes to the source code. If you change the Javascript files, you
   need to re-run ``$ python setup.py install_data``.


You can now make changes and contribute them back to the source code:

1. Create a branch to hold your changes::

    $ git checkout -b my-feature

   and start making changes.

2. Work on your local copy. When you are satisfied with the changes, commit
   them to your local repository::

    $ git add 'FILES THAT YOU MODIFIED'
    $ git commit

   You will be asked to write a commit message. Explain the reasoning behind
   the changes that you made.

3. Propagate the changes back to your github account::

    $ git push -u origin my-feature

4. To integrate the changes into the main code repository, click `Pull Request`
   on the `gmaps` repository page on your accont. This will notify the
   committers who will review your code.

Updating your repository
^^^^^^^^^^^^^^^^^^^^^^^^

To keep your private repository updated, you should add the main repository as 
a remote::
    
    $ git remote add upstream git://github.com/pbugnion/gmaps.git

To update your private repository, you can then fetch new commits from
upstream::

    $ git fetch upstream
    $ git rebase upstream/master


Testing
^^^^^^^

We use nose for unit testing. Run ``nose`` in the root directory of the project to run all the tests,
or in a specific directory to just run the tests in that directory.

Guidelines
----------

Workflow
^^^^^^^^

We loosely follow the `git workflow <http://docs.scipy.org/doc/numpy/dev/gitwash/development_workflow.html>`_ used in numpy development.  Features should
be developed in separate branches and merged into the master branch when
complete. Avoid putting new commits directly in your ``master`` branch.


Code
^^^^

Please follow the `PEP8 conventions <http://www.python.org/dev/peps/pep-0008/>`_ for formatting and indenting code and for variable names.

Ipython notebooks in version control
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This package uses IPython notebooks as examples. If you amend an existing
notebook, or add a new one, make sure that you only commit the input cells.
This can be done by following the recipe given in `this Stack Overflow answer
<http://stackoverflow.com/a/20844506>`_: 

1. Go to the ``scripts`` directory in the gmaps repository.
2. Make the file ``ipynb_output_filter.py``  executable with 
   ``chmod +x ipynb_output_filter.py``. 
3. Put the ``scripts`` directory in the system
   path by adding the following line to your ``.bashrc`` profile::

    export PATH=$HOME/bin:$PATH

4. Update your session to use the new ``.bashrc`` setting by entering
   ``source .bashrc`` in the terminal.

5. Create the file ``~/.gitattributes`` with the following content::
    
    *.ipynb    filter=dropoutput_ipynb

6. Run the following commands::

    git config --global core.attributesfile ~/.gitattributes
    git config --global filter.dropoutput_ipynb.clean ~/bin/ipynb_output_filter.py
    git config --global filter.dropoutput_ipynb.smudge cat

To tell git to ignore outputs and prompt numbers for a particular notebook, 
open the notebook, go to ``Edit > Edit Notebook Metadata``. A popup window will
open containing the following JSON object::

    {
        "name" : "",
        "signature" : "some long hash"
    }

Change this to::

    {
        "name" : "",
        "signature" : "Remember to add a comma after this",
        "vc" : { "suppress_outputs" : true }
    }

Then save the notebook.
