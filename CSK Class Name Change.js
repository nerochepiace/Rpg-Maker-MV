// -----------------------------------------------------------------
// CSK ClassNameChange.js
// Author: Ceschi
// -----------------------------------------------------------------
/*:
* @plugindesc v1.0 Make change name of a class for specified actors.
* @author Ceschi
* 
* @help
* ============================================================================
* Introduction
* ============================================================================
*
* This plugin adds the possibility of change the displayed name of a class,
* when used by a specific actor.
* 
* N.B. This plugin is optimized to be used with Yanfly's Class Change Core 
* Plugin and Yanfly's Skill Learn System Plugin. So, this Plugin must below
* Yanfly's Plugin, on the Plugin Manager.
*
* ============================================================================
* Notetags
* ============================================================================
*
* The following are some notetags you can use with the Class Name Change 
* plugin.
*
* Class Notetags:
*   <Actor x Name y>
*   The name of this class is changed in y if the actor ID using it is x.
*
* ============================================================================
* Changelog
* ============================================================================
*
* Version 1.00:
* - Finished Plugin!
*/
//=============================================================================


var Imported = Imported || {};
Imported.CSK_ClassNameChange = true;

var CSK_ENGINE = CSK_ENGINE || {};
CSK_ENGINE.ClassNameChange = CSK_ENGINE.ClassNameChange || {};

CSK_ENGINE.ClassNameChange.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!CSK_ENGINE.ClassNameChange.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!CSK_ENGINE._loaded_ClassNameChange) {
    this.processCnCNotetags($dataClasses);
    CSK_ENGINE._loaded_ClassNameChange = true;
  }
  return true;
};

DataManager.processCnCNotetags = function(group) {
	var note = /<ACTOR\s(\d+)\sNAME\s(\w+)>/i;
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];			
		obj.classNameChange = [];	
		var notedata = obj.note.split(/[\r\n]+/);
		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(note)) {
				    var actorId = parseInt(RegExp.$1);
					var filename = String(RegExp.$2);
					var reference = {actorId, filename}
					obj.classNameChange.push(reference);			
			}
		}
	}
}



Window_Base.prototype.drawActorClass = function(actor, x, y, width) {
  width = width || 168;
  this.resetTextColor();
  var text = actor.currentClass().name;
  
  var temp;
  var reference = actor.currentClass().classNameChange;
  for (i = 0; i < reference.length; i++) {
	  temp = reference[i];
	  if (temp.actorId == actor._actorId) text = temp.filename;
  }
  
  this.drawText(text, x, y, width);
};

Window_SkillLearnCommand.prototype.drawItemEx = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    var classId = this._list[index].ext;
    this.drawIcon($dataClasses[classId].iconIndex, rect.x, rect.y);
    rect.x += Window_Base._iconWidth + 4;
    rect.width -= Window_Base._iconWidth + 4;
	var text = this.commandName(index);
	
	var temp;
	var reference = $dataClasses[classId].classNameChange;
	for (i = 0; i < reference.length; i++) {
	  temp = reference[i];
	 if (temp.actorId == SceneManager._scene._actor._actorId) text = temp.filename;
	
	}	
	
    this.drawText(text, rect.x, rect.y, rect.width);
};

Window_ClassList.prototype.drawClassName = function(item, x, y, width) {
    this.resetFontSettings();
    var iconBoxWidth = Window_Base._iconWidth + 4;
    this.changeClassNameColor(item);
    this.drawIcon(item.iconIndex, x + 2, y + 2);
	var text = item.name;
    
	var temp;
	var reference = $dataClasses[item.id].classNameChange;
	for (i = 0; i < reference.length; i++) {
		temp = reference[i];
		if (temp.actorId == SceneManager._scene._actor._actorId) text = temp.filename;	
	}	

    this.drawText(text, x + iconBoxWidth, y, width - iconBoxWidth);
};