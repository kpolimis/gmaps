
SRC_DIR = src
BUILD_DIR = build
TPL_DIR = templates
STATIC_DIR = static
GMAPS_ROOT_DIR = ..

IPYNB_FILES = $(shell find $(SRC_DIR) -type f -name '*.ipynb' -not -path "*.ipynb_checkpoints*")
HTML_FILES = $(patsubst $(SRC_DIR)/%.ipynb, $(BUILD_DIR)/%.html, $(IPYNB_FILES))

.PHONY : $(BUILD_DIR)/static $(BUILD_DIR)/.dirstamp all

all : $(BUILD_DIR)/.dirstamp $(BUILD_DIR)/static $(HTML_FILES) $(BUILD_DIR)/static/js/gmaps_views.js

$(BUILD_DIR)/.dirstamp : 
	mkdir -p $(BUILD_DIR) && touch $@
	rsync -rupvE --exclude=*.ipynb --exclude=.ipynb_checkpoints $(SRC_DIR)/ $(BUILD_DIR)

$(BUILD_DIR)/static : 
	rsync -rupvE $(STATIC_DIR) $(BUILD_DIR)

$(BUILD_DIR)/static/js/gmaps_views.js : $(GMAPS_ROOT_DIR)/gmaps/js/gmaps_views.js
	cp $< $@

$(BUILD_DIR)/%.html: $(SRC_DIR)/%.ipynb
	python custom_nbconvert.py $< --output $(@D)/$(*F)

clean:
	rm -rf $(BUILD_DIR)



