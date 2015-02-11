/**
 * XML to MicroXML parser created by Jakob Voß
 */
function MicroXML() {
	function parseNode( node ) {
        if (node.nodeType != 1) return; // skip non-element nodes

        var attrs = { };
        for (var i=0; i<node.attributes.length; i++) {
            var a = node.attributes.item(i);
            var name = a.name;
            if ( !name.match(/^xmlns(:.+)?$/) ) {
                name = name.replace(/^[^:]*:/,'');
                attrs[ a.name ] = a.value;
            }
        }

        // ignores namespace prefixes on element names
        var result = [ node.localName, attrs ];
        var children = node.childNodes;
        
        // child nodes
        for (var i=0; i<children.length; i++) {
            var child = children.item(i);

            if (child.nodeType == 1) {
                child = parseNode(child);
                if (child != null) {
                    result.push( child );
                }
            } else if (child.nodeType == 3 || child.nodeType == 4) {
                var text = child.nodeValue;
                if (text != null && text.trim()!="") {
                    result.push(text);
                }
            }
        }
        
        return result;
	}
	
    this.parse = function(xmlString, depth) {
        if ( !xmlString || typeof xmlString !== "string" ) {
            return;
        }

        try { // Support: IE9 (IE8 would transform tag names to uppercase anyway)
            var parser = new DOMParser();
            xml = parser.parseFromString( xmlString, "text/xml" );

            // invalid XML
            if (!xml || xml.getElementsByTagName("parsererror").length) {
               return;
            }

            xml = parseNode(xml.firstElementChild);
            if (depth) {
                xml = this.simplify(xml,depth);
            } 
            return xml;
        } catch (e) {
            return;
        }
	};

    this.simplify = function(node, depth) {
        if (!depth) {
            return node;
        } else if (node.length == 3 && typeof node[2] == 'string') {
            return node[2];
        }
        var xml = node[1]; // attributes
        for (var i=2; i<node.length; i++) {
            var child = node[i];
            if (typeof child != 'string') {
                var name = child[0];
                var value = this.simplify(child, depth-1);
                if (xml[name] instanceof Array) {
                    xml[name].push(value);
                } else {
                    xml[name] = [ value ];
                }
            }
        }
        // flatten arrays if only child element is a text node
        for (var key in xml) {
            if ( xml[key] instanceof Array && xml[key].length == 1 ) {
                if (typeof xml[key][0] == 'string') {
                    xml[key] = xml[key][0];
                }
            }
        }
        return xml;
    };
}
