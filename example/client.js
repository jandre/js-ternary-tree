/* a smart client.  if < 100 results are returned, build a tree in the browser and search that instead of the server. */


var SearchClient;


SearchClient = function() {
    
    function SearchClient(textbox, output, status, count_status) {
        var self = this;

        self.status = status;
        self.searchcount = 500;
        self.textbox = textbox;
        self.count_status = count_status;
        self.output = output;
        self.current_prefix = "";
        self.tree = null;
        
        return self;
    }

    SearchClient.prototype = {
       
        displayResults: function(matches) {
            var self = this;
            self.count_status.html(matches.length);
            if (matches.length == 0) {
                self.output.text("No results found");
            } else {
                var text = ""
                for (i in matches) {
                    text += "<div>" + matches[i] + "</div>";
                    

                }
                self.output.html(text);
            }


            /* display results in text box, or "not found" if not found. */
        },
        
        beginsWith: function(needle, haystack) {
            if(haystack.substr(0, needle.length) == needle){
                return true;
            }
            return false;
        },


        search: function() {
            var self = this;
            
            prefix = self.textbox.val();

            if (self.current_prefix != "") {
                
                if (!self.beginsWith(self.current_prefix, prefix))
                {
                    /* if the saved search doesn't match, don't use it. */
                    self.tree = null;
                }
            }

            self.current_prefix = prefix;
           
            if (self.tree != null) {
                self.status.html("<span style=\"color: blue\">searching on client...</span>");
                matches = self.tree.search(prefix);
                console.log("using client to query for: " + prefix);
                self.displayResults(matches);
                return;
            }

            /* return results for prefix on server. */
            search_count = self.searchcount + 1;

            url = "/search?query=" + prefix + "&count=" + search_count;

            self.status.html("<span style=\"color: red\">searching on server...</span>");
            $.get(url, function(data) {

                console.log("using server for query " + url);
                if (data.count < self.searchcount) 
                {
                    self.tree = new TernaryTree();
                    for (i in data.matches) {
                        self.tree.add(data.matches[i]);
                    }
                }
                self.displayResults(data.matches);

            }); 

        
        }

    };


    return SearchClient;
}();





$(function() {
        var textbox = $('#search_box');
        var output = $('#results');
        var status = $('#status');
        var count_status = $('#count');
        
        var searchClient = new SearchClient(textbox, output, status, count_status); 
       
        var handleChange = function() {

            if (textbox.val().length > 1) {
                searchClient.search();
            
            }
            
        }

        textbox.keyup(handleChange);
  });





