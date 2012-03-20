var TernaryTree;
var Node;

Node = function() {

    function Node(character, is_word_end) {
        var self = this;
        self.character = character;
        self.left_node = null;
        self.right_node = null;
        self.center_node = null;
        self.is_word_end = is_word_end;

        return self;
    };

    Node.prototype = {

        set_word_end: function()
        {
            var self = this;
            self.is_word_end = true;
        },

        left: function(node)
        {
            var self = this;

            if (node != undefined && node != null) {
                self.left_node = node;
            }

            return self.left_node;
        },

        right: function(node) {

            var self = this;
            if (node != undefined && node != null) {
                self.right_node = node;
            }

            return self.right_node;
        },

        center: function(node) {

            var self = this;

            if (node != undefined && node != null) {
                self.center_node = node;
            }

            return self.center_node;
        }

    };

    return Node;
}();



TernaryTree = function() {
    

    function TernaryTree() {

        var self = this;
        
        self.root = null;
        
        return self;
    };


    TernaryTree.prototype = {
   
        _add: function(word, position, node_accessor) {
            
            var self = this;

            if (word == null || word == "")
                return;

            var node = node_accessor();
            
            if (node == null) {

                node = new Node(word[position], false);
           
                node_accessor(node);
                
            }
            
            var char = node.character;

            
            if (word[position] < char) {
                self._add(word, position, function(n) { return node.left(n); } );
            } else if (word[position] > char) {
                self._add(word, position, function(n) { return node.right(n); } );
            } else {
                if (position == (word.length - 1)) {
                    node.set_word_end();
                    /* node.is_word_end = true;*/
                } else {
                    self._add(word, position + 1, function(n) { return node.center(n); } );
                }
            }

        },

        add: function(word) {
            /* add a string to the tree */
        
            var self = this;

            var node_accessor = function(node) {

                if (node != undefined && node != null)
                    self.root = node;

                return self.root;
            };

            self._add(word, 0, node_accessor);

            return self;
        },

        _all_possible_suffixes : function(node, current_prefix, maxcount) {
            var self = this;

            if (node == null || node == undefined)
                return [];

            var char = node.character;
            
            if (current_prefix == undefined || current_prefix == null) 
                current_prefix = "";

            var result = [];
    
            var right_suffixes = [], left_suffixes = [], center_suffixes = [];

            if (node.right() != null) {
                right_suffixes = self._all_possible_suffixes(node.right(), current_prefix);
            } 
            
            if (node.left() != null) {
                left_suffixes = self._all_possible_suffixes(node.left(), current_prefix);
            }
            
            var new_prefix = current_prefix + node.character;
            
            if (node.is_word_end) {
                result.push(new_prefix);
            }

            if (node.center() != null) {
                center_suffixes = self._all_possible_suffixes(node.center(), new_prefix);
            }

            result = result.concat(right_suffixes, left_suffixes, center_suffixes); 
            return result;

        },

        search: function(prefix, maxcount) {
            var self = this;
            var result = [];
            

            var word = prefix;
            var last_character_in_word = (word == "") ? 0 : (word.length - 1);
            var node = self.root;
            var position = 0;
            while (node != null) {

                if (word[position] < node.character)
                    node = node.left();
                else if (word[position] > node.character)
                    node = node.right();
                else {

                    if (position == last_character_in_word) { /* end */
                        var suffixes = self._all_possible_suffixes(node.center(), prefix, maxcount);
                        if (node.is_word_end)
                            suffixes.push(prefix);
                        return suffixes;
                    }

                    node = node.center();
                    position = position + 1;
                }
                            
            }


            return result;

            
        },

        size: function() {
            /* return the # of words added to the tree. */

        }

        
    };

    return TernaryTree;
}();


if (typeof exports != 'undefined') {
    /* all for node.js */
    exports.TernaryTree = TernaryTree;
    exports.Node = Node;
}
