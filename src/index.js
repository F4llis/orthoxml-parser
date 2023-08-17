var sax = require('sax');

const parse = function(orthoxml){

    var build_leaf = function(gene_ref){

        var mapped = _mapping[parseInt(gene_ref.attributes.id, 10)]


        var leaf = {
            id: mapped.protid,
            species: mapped.species
        }

        if (gene_ref.attributes.LOFT) {
            leaf.LOFT = gene_ref.attributes.LOFT
        }

        return leaf

    }

    var build_node = function(group){

        var node =  {
            id: group.attributes.id ? group.attributes.id : 'Unknown'  ,
            parent: _current,
            children : [],
            paralog: group.name == 'paralogGroup' ? true: false,
            species: null,
            CompletenessScore: null,
            taxid: null,
            nr_members: null,
        }

        return node

    }

    var openTag = function (args) {

        var tagName =  args.name;

        if (tagName === "geneRef") {
            var l = build_leaf(args)
            _current.children.push(l)
        }

        else if (tagName === "species") {
            _species =  args.attributes.name
        }

        else if (tagName === "gene") {
            _mapping[args.attributes.id] =  {protid: args.attributes.protId, species: _species }
        }

        else if (tagName === "orthologGroup" || tagName === "paralogGroup" ) {

            var n = build_node(args);

            _current.children.push(n)
            _current = n

        }

        else if ( tagName === "property" && args.attributes.name === "TaxRange" ) {
            _current.species = args.attributes.value
        }

        else if ( tagName === "property" && args.attributes.name === "NrMemberGenes" ) {
            _current.nr_members = args.attributes.value
        }

        else if ( tagName === "property" && args.attributes.name === "taxid" ) {
            _current.taxid = args.attributes.value
        }

        else if ( tagName === "score" ) {
            _current[args.attributes.id ] = args.attributes.value
        }


    };

    var closeTag = function (name) {


        var tagName =  name; // xmlns

    if (tagName === "orthologGroup" || tagName === "paralogGroup") {

        _current = _current.parent

        }

    else if (tagName === "species") {
        _species =  null;
    }

    };


    var parser = sax.parser(true, {});
    var _current = {'children': []};
    var _mapping = {};
    var _species = null;

    parser.onopentag = openTag;
    parser.onclosetag = closeTag;

    parser.write(orthoxml).close();

    return _current.children[0]
}

export { parse }