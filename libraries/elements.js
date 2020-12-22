
function newElement(elementType,appendElementTo) {
    
    theElement = document.createElement(elementType);
    appendElementTo.appendChild(theElement);
    
    return theElement;
}

function newAttribute(appendAttributeTo,attributeType,attributeValue) {

    theAttribute = document.createAttribute(attributeType);
    theAttribute.value = attributeValue;
    appendAttributeTo.setAttributeNode(theAttribute);

}

function testDebug() {
    
    testImg = newElement("img",document.getElementById("element"));

    newAttribute(testImg,"src","https://kyriaelixia.github.com/server/games/minesweeper/sprites/tiles/tile.png");
    newAttribute(testImg,"width","150");
    newAttribute(testImg,"height","150");
    newAttribute(document.getElementById("element"),"align","center")
}
