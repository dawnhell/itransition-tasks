var currentEditor;
var currentFile;

function runAce(fileName, code) {
  var editor = ace.edit("ace-editor");
  currentEditor = editor;
  currentFile = fileName;
  editor.setTheme("ace/theme/github");
  editor.setValue(code);
  editor.setHighlightActiveLine(false);
  editor.clearSelection();
}

function destroyAce() {
  var editor = $("#ace-editor");
  editor.innerHTML = "";
}

function getCurrentCode() {
  return currentEditor.getValue();
}

function runHexEditor() {
  var file = new File([getCurrentCode()], currentFile);
  var reader = new FileReader();
  reader.onloadend = function (evt) {
    buff = evt.target.result;
    hexData = new HexData(buff);
    initAll();
  };
  reader.readAsArrayBuffer(file);
}

function findCharacter(index) {
  console.log(index);
  var code = getCurrentCode();
  currentEditor.moveCursorToPosition(index);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var buff;
var originalBuff;
var offset = 0;
var size = 0;
var LINES = 20;
var hexData;
var currentKeyUpEditState = 0;
var filename;
var fileType;

var selstart = -1;
var sellen = -1;

function handleFileSelect(evt) {
  // evt.stopPropagation();
  // evt.preventDefault();

  // var files = evt.dataTransfer ?  evt.dataTransfer.files : evt.target.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  // var output = [];

  // for (var i = 0, f; f = files[i]; i++) {
    // output.push('<span><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',f.size, ' bytes', '</span>');
    // filename = f.name;
    // fileType = f.type;
    // size = f.size;

    // var reader = new FileReader();
    // reader.onloadend = function (evt) { buff = evt.target.result; hexData = new HexData(buff); initScroll();  initAll();};
    // reader.readAsArrayBuffer(f);
  // }

  //document.getElementById('fileinfo').innerHTML = output.join('');

  // $('#header').css('height', '7%');
  // $('#content').show();
  // $('.rightButtonsContainer').show();
}

function handleDragOver(evt) {
  // evt.stopPropagation();
  // evt.preventDefault();
  // evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

$(document).ready(function () {
  $("#dialog").dialog({
    modal: true,
    dialogClass: "alert",
    autoOpen: false,
    closeText: '',
    bgiframe: true,
    closeOnEscape: false,
    buttons: [
      {
        text: "Cancel",
        click: function() {
          $(this).dialog("close");
        }
      },
      {
        text: "Enter",
        click: function() {
          var character = document.getElementById('characterInput');
          $(this).dialog("close");
        }
      }
    ],
    focus: function(event, ui) {
      var character = document.getElementById('characterInput');
      var code = document.getElementById('codeInput');

      character.addEventListener('input', function() {
        if(character.value) {
          code.value = character.value.charCodeAt(0);
        }
      });

      code.addEventListener('input', function() {
        if(code.value) {
          character.value = String.fromCharCode(code.value);
        }
      });
    }
  });
  // Setup the dnd listeners.
  // var dropZone = document.getElementById('header');
  // dropZone.addEventListener('dragover', handleDragOver, false);
  // dropZone.addEventListener('drop', handleFileSelect, false);
  $("input[type='radio']").click(function () {
    var previousValue = $(this).attr('previousValue');
    var name = $(this).attr('name');
    var id = $(this).attr('id');

    if (previousValue == 'checked') {
      $(this).removeAttr('checked');
      $(this).attr('previousValue', false);
      onBinaryEdit( parseInt(id.replace("editBin","")), false);
    }
    else {
      $("input[name=" + name + "]:radio").attr('previousValue', false);
      $(this).attr('previousValue', 'checked');
      onBinaryEdit(parseInt(id.replace("editBin", "")), true);
    }
  });

  $('#hexcol').click(function () {
    $(this).focus();
  }).keypress(function (event) {
    onHexaEditKeyPress(event.charCode);
  });

  $('#editUpperHexa').change(function () {
    onHexaSelectEdit( $(this).val(), 0);
  });

  $('#editLowerHexa').change(function () {
    onHexaSelectEdit( $(this).val(), 1);
  });
});

function initOffsetCol() {

  $('#offsetcol').empty();
  for (var i = 0; i < 16 * LINES; i += 16) {
    $('#offsetcol').append('<div class="offsetcell" off="00000000">' + zeroFill((offset + i).toString(16), 8) + '</div>');
  }
}

function initHexCol() {
  var bin = hexData.hexDataArray.slice(offset, offset + LINES * 16);
  var limit = bin.length;

  var pos = 0;
  $('#hexcol').empty();
  for (var l = 0; l < LINES; l++) {
    $('#hexcol').append('<div>');
    for (var i = 0; i < 16; i++) {
      if (pos < limit) {
        var bt = bin[pos].decimalVal;

        $('#hexcol').append('<span class="hexcell '
          + (bin[pos].pos == hexData.selectedPos ? "hexcell-sel" : "")
          + (bin[pos].decimalVal != bin[pos].initialDecimalVal ? " hexcell-modified" : "")
          + ((hexData.searchResultsPos.indexOf( bin[pos].pos))> -1? " hexcell-search" : "")
          + '" onClick="hexcellSel(this)"    pos="' + pos.toString() + '" absPos="'+  bin[pos].pos
          + '" id="off' + pos.toString(16) + '"  tabIndex=' + (pos + 1) + '  style="padding: 6px 3px; font-size: 14px;" >' + zeroFill(bt.toString(16), 2) + '</span>');

        pos++;

        if (i == 7)
          $('#hexcol').append('&nbsp;');
      }
    }
    $('#hexcol').append('<div>');
  }
}

function initAsciiCol() {

  var bin = hexData.hexDataArray.slice(offset, offset + LINES * 16);
  var limit = bin.length;

  var pos = 0;
  $('#asciicol').empty();
  for (var l = 0; l < LINES; l++) {
    var line = '<div>';
    for (var i = 0; i < 16; i++) {
      if (pos < limit) {
        var bt = bin[pos].decimalVal;

        ch = asString(bt);

        line += '<span class="asciicell" id="asc' + pos.toString(16) + '"  absPosAscii="' +  bin[pos].pos  +'" >' + ch + '</span>';

        pos++;
      }
    }
    line += '</div>';
    $('#asciicol').append(line);
  }
}

function initAll() {
  initOffsetCol();
  initHexCol();
  initAsciiCol();
}

var firstTime  = false;

function initScroll() {

}

function SlideEventHandler() {
  Slide($('#slider-vertical').val());
}

function Slide(val) {
  offset = 16 * Math.max(0, Math.floor(val));
  initOffsetCol();
  initHexCol();
  initAsciiCol();

  var totalLines = Math.floor(hexData.hexDataArray.length/16);

  $('#offsetDecimal').val(offset.toString());
  $('#offsetHexa').val('0x' + offset.toString(16));
  $('#offsetPercent').val(parseInt((val/totalLines) * 100) + '%');
}

var last = null;

function hexcellSel(cell) {
  findCharacter(parseInt($(cell).attr('pos')));

  if(last) {
    document.getElementById(last.id).style.border = "none";
    document.getElementById(last.id).style.padding = "6px 3px";
  }
  document.getElementById(cell.id).style.border = "2px solid #888888";
  document.getElementById(cell.id).style.padding = "4px 1px";

  var absPos = parseInt($(cell).attr('absPos'));
  if (selstart >= 0) {
    // deselect

    var pos = selstart - offset;

    if (pos >= 0 && pos < LINES * 16) {
      $('#off' + pos.toString(16)).removeClass('hexcell-sel');
      $('#asc' + pos.toString(16)).removeClass('selected');
    }

  }

  selstart = offset + parseInt($(cell).attr('pos'));
  hexData.selectedPos = absPos;
  setValueUI(absPos);
  $('#' + $(cell).attr('id').replace('off', 'asc')).addClass('selected');

  $(cell).addClass('hexcell-sel');
  currentKeyUpEditState = 0;
  last = cell;
}

function hexcellSelByPos(absPos) {

  if (absPos >= hexData.hexDataArray.length) {
    return false;
  }

  var cell = $('span[absPos="' + absPos + '"]');

  if (selstart >= 0) {
    // deselect
    var pos = selstart - offset;

    if (pos >= 0 && pos < LINES * 16) {
      $('#off' + pos.toString(16)).removeClass('hexcell-sel');
      $('#asc' + pos.toString(16)).removeClass('selected');
    }

  }

  selstart = offset + parseInt(cell.attr('pos'));
  hexData.selectedPos = absPos;
  setValueUI(absPos);
  $('#' + cell.attr('id').replace('off', 'asc')).addClass('selected');

  cell.addClass('hexcell-sel');

}

function setValueUI(pos) {
  $('#editDecimal').val(hexData.hexDataArray[pos].decimalVal);
  var hexa = zeroFill(hexData.hexDataArray[pos].decimalVal.toString(16), 2).toUpperCase();
  $('#editUpperHexa').val(hexa[0] + "");
  $('#editLowerHexa').val(hexa[1] + "");
  var bin = zeroFill(hexData.hexDataArray[pos].decimalVal.toString(2), 8);

  for (var i = 0; i < bin.length; ++i)
  {
    $('#editBin' + i).prop('checked', bin[i] == "1");
  }

  var char = asString(hexData.hexDataArray[pos].decimalVal);

  $('span[absPosAscii="' + pos + '"]').html(char);
  $('span[absPos="' + pos + '"]').html(hexa.toLowerCase());
}

function onHexaEditKeyPress(charCode) {

  if (hexData && hexData.selectedPos >= 0) {
    var charCode = String.fromCharCode(event.charCode).toLowerCase()[0];
    if ((charCode >= '0' && charCode <= '9') || (charCode >= 'a' && charCode <= 'f')) {

      var currentHex = asHex(hexData.hexDataArray[hexData.selectedPos].decimalVal,true);
      currentHex = currentKeyUpEditState == 0 ? (charCode + currentHex[1]) : (currentHex[0] + charCode);
      $('span[absPos="' + hexData.selectedPos + '"]').html(currentHex);
      var decimalValue = getDecimalFromHex(currentHex);

      hexData.hexDataArray[hexData.selectedPos].changeValue(decimalValue);
      setValueUI(hexData.selectedPos);
      $('span[absPos="' + hexData.selectedPos + '"]').addClass('hexcell-modified');

      currentKeyUpEditState++;

      if (currentKeyUpEditState == 2) {
        hexcellSelByPos(hexData.selectedPos+1);
        currentKeyUpEditState = 0;
      }
    }
  }
  SaveFile();
}

function onHexaSelectEdit(charCode,level) {
  if (hexData && hexData.selectedPos >= 0) {
    var currentHex = asHex(hexData.hexDataArray[hexData.selectedPos].decimalVal, true);
    currentHex = level == 0 ? (charCode + currentHex[1]) : (currentHex[0] + charCode);

    var decimalValue = getDecimalFromHex(currentHex);

    hexData.hexDataArray[hexData.selectedPos].changeValue(decimalValue);
    setValueUI(hexData.selectedPos);
    $('span[absPos="' + hexData.selectedPos + '"]').addClass('hexcell-modified');
  }
}

function onDecimalEditChange() {
  if (hexData && hexData.selectedPos >= 0) {
    var value = parseInt($('#editDecimal').val());
    hexData.hexDataArray[hexData.selectedPos].changeValue(value);
    setValueUI(hexData.selectedPos);
    $('span[absPos="' + hexData.selectedPos + '"]').addClass('hexcell-modified');
  }
}

function onBinaryEdit(bit, isSet) {
  if (hexData && hexData.selectedPos >= 0) {
    var currentBinary = zeroFill(hexData.hexDataArray[hexData.selectedPos].decimalVal.toString(2), 8);
    var newCurrentBinarryArray = currentBinary.split("");
    newCurrentBinarryArray[bit] = isSet == true ? "1" : "0";
    var newBin = newCurrentBinarryArray.join("");

    var decimalValue = parseInt( newBin, 2);
    hexData.hexDataArray[hexData.selectedPos].changeValue(decimalValue);
    setValueUI(hexData.selectedPos);
    $('span[absPos="' + hexData.selectedPos + '"]').addClass('hexcell-modified');
  }
}

function SaveFile() {

  var array = new Uint8Array( hexData.hexDataArray.length);

  for (var i = 0; i < hexData.hexDataArray.length; ++i) {
    array[i] = hexData.hexDataArray[i].decimalVal;
  }
  var newCode = new TextDecoder("utf-8").decode(array);
  runAce(currentFile, newCode);

  // var b64 = btoa(String.fromCharCode.apply(null, array));

  // var a = document.createElement("a");
  // a.style = "display: none";
  // fileType = fileType || 'application/octet-stream';
  // a.setAttribute('download', filename);
  // a.href = 'data:' + fileType + ';base64,' + b64;

  // document.body.appendChild(a);
  // a.click();
}

function Revert() {
  hexData.revert();

  $('.hexcell-modified').each(function (index,elem) {
    $(elem).removeClass('hexcell-modified');

    var absPos = parseInt($(elem).attr('absPos'));
    var decimal = hexData.hexDataArray[absPos].decimalVal;
    var hexa = asHex(decimal,true);
    var char = asString(decimal);

    $(this).html(hexa);
    $('span[absPosAscii="' + absPos + '"').html(char);
  });
}

function Search() {
  var addressToGo =   hexData.search( $('#searchTextType').val(),  $('#searchText').val(), $('#address').val());
  $('span[absPos]').removeClass('hexcell-search');
  for (var i = 0; i < hexData.searchResultsPos.length; ++i) {
    $('span[absPos="' + hexData.searchResultsPos[i] + '"]').addClass('hexcell-search');
  }

  if (addressToGo > -1) {
    SetOffsetUI(addressToGo);
  }
}

function GoToAddressDecimal() {
  var offsetDecimal = $('#offsetDecimal').val();
  SetOffsetUI(offsetDecimal);
}

function GoToAddressHexa() {
  var offsetHexa = $('#offsetHexa').val().replace("0x", "");
  var decimal = getDecimalFromHex(offsetHexa);
  SetOffsetUI(decimal);
}

function GoToAddressPercent() {
  var totalLines = Math.floor(hexData.hexDataArray.length / 16);
  var perc = parseFloat($('#offsetPercent').val().replace('%',''));
  var val = 16 * (perc * totalLines / 100);
  SetOffsetUI(val);
}

function SetOffsetUI(decimalAddress) {
  var lines = decimalAddress/ 16;
  Slide(lines);
  $('#slider-vertical').val(lines);
}

function onSearchTypeChange() {
  var searchType = $('#searchTextType').val();

  if (searchType == "Decimal") {
    $('#labelSearch').html('Decimals:');
    $('#searchText').attr('placeholder', 'Enter like: this 1 2 44');
  }

  if (searchType == "Hexa") {
    $('#labelSearch').html('Hexas:');
    $('#searchText').attr('placeholder', 'Enter like: this 1 ab ff');
  }

  if (searchType == "Char") {
    $('#labelSearch').html('Characters:');
    $('#searchText').attr('placeholder', 'Enter like: test');
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function asHex(i,lower) {
  h = lower == true ? i.toString(16).toLowerCase(): i.toString(16).toUpperCase();
  return (h.length % 2 != 0)? '0' + h : h;
}

//var fu = paddy(14, 5); // 00014
//var bar = paddy(2, 4, '#'); // ###2
function zeroFill(n, p, c) {
  var pad_char = typeof c !== 'undefined' ? c : '0';
  var pad = new Array(1 + p).join(pad_char);
  return (pad + n).slice(-pad.length);
}

function asString(dec) {
  var ch = '.';
  if (dec == 32)
    ch = '&nbsp;';
  else if (dec >= 32 && dec < 127)
    ch = String.fromCharCode(dec);

  return ch;
}

function getDecimalFromHex(hex) {
  return parseInt(hex, 16);
}



function Hex(decimalVal,pos)
{
  this.decimalVal = decimalVal;
  this.pos = pos;
  this.initialDecimalVal = decimalVal;

  this.changeValue = function (newDecimalValue) {
    this.initialDecimalVal = this.decimalVal;
    this.decimalVal = newDecimalValue;
  };
}


function HexData(buff)
{
  // console.log(buff + "!!!!!");
  var arrayHex = new Array(buff.length);
  var arrayBytes = new Uint8Array(buff);

  for (var i = 0; i < arrayBytes.length; ++i) {
    arrayHex[i] = new Hex( arrayBytes[i], i);
  }

  this.hexDataArray = arrayHex;
  this.selectedPos = -1;
  this.searchResultsPos = new Array();

  this.setSelectedPos = function (i) {
    this.selectedPos = i;
  };

  this.revert = function () {
    for (var i = 0; i < arrayBytes.length; ++i) {
      arrayHex[i].decimalVal = arrayHex[i].initialDecimalVal;
    }
  };

  this.search = function (searchType,searchText,address) {

    var searchResultPos = new Array();
    var searchArrayDec = new Array();
    var searchArrayHexa = new Array();
    var searchArrayChars = new Array();

    var decSplit, hexaSplit, charSplit;

    if (searchType == "Decimal") {
      decSplit = searchText.split(" ");
    } else {
      decSplit = new Array();
    }

    if (searchType == "Hexa") {
      if (searchText.indexOf(' ') == -1) {
        hexaSplit = new Array();
        for (var i = 0; i < searchText.length; i += 2) {
          if (i + 1 < searchText.length) {
            hexaSplit.push(searchText[i] + "" + searchText[i + 1]);
          }
        }
      }
      else {
        hexaSplit = searchText.split(" ");
      }

    } else {
      hexaSplit = new Array();
    }

    if (searchType == "Char") {
      charSplit = searchText.split("");
    } else {
      charSplit = new Array();
    }

    if (decSplit.length > 0) {
      for (var i = 0; i < decSplit.length; ++i) {
        if (decSplit[i].match(/^\d{1,3}$/)){
          searchArrayDec.push(parseInt(decSplit[i]));
        }
      }
    }

    if (hexaSplit.length > 0) {
      for (var i = 0; i < hexaSplit.length; ++i) {
        if (hexaSplit[i].match(/^[0-9A-Fa-f]{2}$/)) {
          searchArrayHexa.push(getDecimalFromHex(hexaSplit[i]));
        }
      }
    }

    if (charSplit.length > 0) {
      for (var i = 0; i < charSplit.length; ++i) {
        if (charSplit[i] != "") {
          searchArrayChars.push(charSplit[i].charCodeAt(0));
        }
      }
    }

    for (var i = 0; i < arrayBytes.length; ++i) {
      var isDec = searchArrayDec.indexOf(this.hexDataArray[i].decimalVal) > -1;
      var isHexa = searchArrayHexa.indexOf(this.hexDataArray[i].decimalVal) > -1;
      var isChar = searchArrayChars.indexOf(this.hexDataArray[i].decimalVal) > -1;

      if (isDec && (i + searchArrayDec.length - 1) < this.hexDataArray.length) {
        var ok = true;
        for (var j = i+1; j < i + searchArrayDec.length; ++j) {
          if (this.hexDataArray[j].decimalVal != searchArrayDec[j - i]) {
            ok = false;
            break;
          }
        }

        if (ok == true) {
          for (var k = 0; k < searchArrayDec.length; ++k) {
            if (searchResultPos.indexOf(searchArrayDec) < 0) {
              searchResultPos.push(this.hexDataArray[i + k].pos);
            }
          }
        }
      }

      if (isHexa && (i + searchArrayHexa.length - 1) < this.hexDataArray.length) {
        var ok = true;
        for (var j = i+1; j < i + searchArrayHexa.length; ++j) {
          if (this.hexDataArray[j].decimalVal != searchArrayHexa[j - i]) {
            ok = false;
            break;
          }
        }

        if (ok == true) {
          for (var k = 0; k < searchArrayHexa.length; ++k) {
            if (searchResultPos.indexOf(searchArrayHexa) < 0) {
              searchResultPos.push(this.hexDataArray[i + k].pos);
            }
          }
        }
      }


      if (isChar && i + searchArrayChars.length < this.hexDataArray.length) {
        var ok = true;
        for (var j = i + 1; j < i + searchArrayChars.length; ++j) {
          if (this.hexDataArray[j].decimalVal != searchArrayChars[j - i]) {
            ok = false;
            break;
          }
        }

        if (ok == true) {
          for (var k = 0; k < searchArrayChars.length; ++k) {
            if (searchResultPos.indexOf(searchArrayChars) < 0) {
              searchResultPos.push(this.hexDataArray[i + k].pos);
            }
          }
        }
      }
    }


    var addressDecimal = getDecimalFromHex(address);

    if (addressDecimal <= this.hexDataArray.length) {
      for (var i = 0; i < 16; ++i) {

        if (i > 0 && (addressDecimal + i) % 16 == 0) {
          break;
        }

        if ( addressDecimal + i <  this.hexDataArray.length &&   searchResultPos.indexOf(this.hexDataArray[addressDecimal + i]) < 0) {
          searchResultPos.push(this.hexDataArray[addressDecimal + i].pos);
        }
      }
      this.searchResultsPos = searchResultPos;
      return addressDecimal;
    }

    this.searchResultsPos = searchResultPos;
    return -1;
  };

}