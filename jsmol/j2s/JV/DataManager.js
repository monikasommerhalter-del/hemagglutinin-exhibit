Clazz.declarePackage("JV");
Clazz.load(["J.api.JmolDataManager", "java.util.Hashtable"], "JV.DataManager", ["JU.AU", "$.BS", "$.Lst", "$.PT", "$.SB", "J.c.VDW", "JS.T", "JU.BSUtil", "$.Elements", "$.Escape", "$.Logger", "$.Parser"], function(){
var c$ = Clazz.decorateAsClass(function(){
this.dataValues = null;
this.vwr = null;
Clazz.instantialize(this, arguments);}, JV, "DataManager", null, J.api.JmolDataManager);
Clazz.prepareFields (c$, function(){
this.dataValues =  new java.util.Hashtable();
});
Clazz.makeConstructor(c$, 
function(){
});
Clazz.overrideMethod(c$, "set", 
function(vwr){
this.vwr = vwr;
return this;
}, "JV.Viewer");
Clazz.overrideMethod(c$, "clear", 
function(){
this.dataValues.clear();
});
Clazz.overrideMethod(c$, "setData", 
function(type, data, atomCount, actualAtomCount, matchField, matchFieldColumnCount, field, fieldColumnCount){
try {
if (type == null) {
this.clear();
return;
}type = type.toLowerCase();
if (type.equals("element_vdw")) {
this.setVDW(data);
return;
}var newType = this.getType(data);
data[3] = Integer.$valueOf(newType);
var newVal = data[1];
if (newType == -1) {
data[3] = Integer.$valueOf(newType = this.getTypeFor(newVal));
}if (data[2] == null || atomCount <= 0) {
this.dataValues.put(type, data);
return;
}if (newType == -1) {
JU.Logger.error("Cannot determine data type for " + newVal);
return;
}var bs;
var stringData = null;
var tokens = null;
var d = null;
var dd = null;
var dData = null;
var ddData = null;
var createNew = (matchField != 0 || field != -2147483648 && field != 2147483647);
var oldData = this.dataValues.get(type);
var oldValue = (oldData == null ? null : oldData[1]);
if (newType != 2) {
d = (oldData == null || createNew ?  Clazz.newFloatArray (actualAtomCount, 0) : JU.AU.ensureLengthA(oldValue, actualAtomCount));
}switch (newType) {
case 0:
stringData = newVal;
break;
case 1:
dData = newVal;
break;
case 2:
ddData = newVal;
break;
}
if (field == -2147483648 && (tokens = JU.PT.getTokens(stringData)).length > 1) {
field = 0;
}if (field == -2147483648) {
bs = data[2];
JV.DataManager.setSelected(JU.PT.parseFloat(stringData), bs, d);
} else if (field == 0 || field == 2147483647) {
bs = data[2];
if (dData != null) {
var n = dData.length;
if (n == bs.cardinality()) {
this.fillSparseArray(dData, bs, d);
} else {
for (var i = bs.nextSetBit(0); i >= 0 && i < n; i = bs.nextSetBit(i + 1)) d[i] = dData[i];

}} else if (stringData != null) {
JU.Parser.parseFloatArrayBsData(tokens == null ? JU.PT.getTokens(stringData) : tokens, bs, d);
} else if (ddData != null) {
var n = ddData.length;
dd = (oldData == null || createNew ? JU.AU.newFloat2(actualAtomCount) : JU.AU.ensureLength(oldValue, actualAtomCount));
if (n == bs.cardinality()) {
for (var i = bs.nextSetBit(0), pt = 0; i >= 0; i = bs.nextSetBit(i + 1), pt++) this.fillSparseArray(ddData[pt], bs, dd[i] =  Clazz.newFloatArray (actualAtomCount, 0));

} else {
for (var i = bs.nextSetBit(0); i >= 0 && i < n; i = bs.nextSetBit(i + 1)) dd[i] = ddData[i];

}}} else if (matchField <= 0) {
bs = data[2];
JU.Parser.parseFloatArrayFromMatchAndField(stringData, bs, 0, 0, null, field, fieldColumnCount, d, 1);
} else {
var iData = data[2];
JU.Parser.parseFloatArrayFromMatchAndField(stringData, null, matchField, matchFieldColumnCount, iData, field, fieldColumnCount, d, 1);
bs =  new JU.BS();
for (var i = iData.length; --i >= 0; ) if (iData[i] >= 0) bs.set(iData[i]);

}if (oldData != null && Clazz.instanceOf(oldData[2],"JU.BS") && !createNew) bs.or((oldData[2]));
data[2] = bs;
if (dd == null) {
data[3] = Integer.$valueOf(1);
data[1] = d;
} else {
data[3] = Integer.$valueOf(2);
data[1] = dd;
}if (type.indexOf("property_atom.") == 0) {
this.setAtomProperty(type, bs, d);
return;
}this.dataValues.put(type, data);
} catch (e) {
if (Clazz.exceptionOf(e, Exception)){
JU.Logger.error("DataManager failed :" + e);
e.printStackTrace();
} else {
throw e;
}
}
}, "~S,~A,~N,~N,~N,~N,~N,~N");
Clazz.defineMethod(c$, "setAtomProperty", 
function(type, bs, d){
var tok = JS.T.getSettableTokFromString(type = type.substring(14));
if (tok == 0) {
JU.Logger.error("Unknown atom property: " + type);
return;
}var nValues = bs.cardinality();
var fValues =  Clazz.newFloatArray (nValues, 0);
for (var n = 0, i = bs.nextSetBit(0); n < nValues; i = bs.nextSetBit(i + 1)) fValues[n++] = d[i];

this.vwr.setAtomProperty(bs, tok, 0, 0, null, fValues, null);
}, "~S,JU.BS,~A");
Clazz.defineMethod(c$, "setVDW", 
function(data){
var stringData = (data[1]).trim();
if (stringData.length == 0) {
this.vwr.userVdwMars = null;
this.vwr.userVdws = null;
this.vwr.bsUserVdws = null;
} else {
if (this.vwr.bsUserVdws == null) this.vwr.setUserVdw(this.vwr.defaultVdw);
JU.Parser.parseFloatArrayFromMatchAndField(stringData, this.vwr.bsUserVdws, 1, 0, data[2], 2, 0, this.vwr.userVdws, 1);
for (var i = this.vwr.userVdws.length; --i >= 0; ) this.vwr.userVdwMars[i] = Clazz.doubleToInt(Math.floor(this.vwr.userVdws[i] * 1000));

}}, "~A");
Clazz.defineMethod(c$, "getTypeFor", 
function(newVal){
return ((typeof(newVal)=='string') ? 0 : JU.AU.isAF(newVal) ? 1 : JU.AU.isAFF(newVal) ? 2 : JU.AU.isAFFF(newVal) ? 3 : -1);
}, "~O");
Clazz.defineMethod(c$, "fillSparseArray", 
function(floatData, bs, f){
for (var i = bs.nextSetBit(0), pt = 0; i >= 0; i = bs.nextSetBit(i + 1), pt++) f[i] = floatData[pt];

}, "~A,JU.BS,~A");
Clazz.defineMethod(c$, "getType", 
function(data){
return (data[3]).intValue();
}, "~A");
c$.setSelected = Clazz.defineMethod(c$, "setSelected", 
function(f, bs, data){
var isAll = (bs == null);
var i0 = (isAll ? 0 : bs.nextSetBit(0));
for (var i = i0; i >= 0 && i < data.length; i = (isAll ? i + 1 : bs.nextSetBit(i + 1))) data[i] = f;

}, "~N,JU.BS,~A");
Clazz.overrideMethod(c$, "getData", 
function(label, bsSelected, dataType){
if (label == null) return null;
if (label.endsWith("*")) {
var list =  new JU.Lst();
label = label.substring(0, label.length - 1);
var len = label.length;
for (var key, $key = this.dataValues.keySet().iterator (); $key.hasNext()&& ((key = $key.next ()) || true);) {
if (len == 0 || key.length >= len && key.substring(0, len).equalsIgnoreCase(label)) {
list.addLast(key);
}}
return list;
}if (this.dataValues.size() == 0) return null;
label = label.toLowerCase();
switch (dataType) {
case -1:
case -2:
if (!label.equals("types")) return this.dataValues.get(label);
var info =  new Array(2);
info[0] = "types";
info[1] = "";
var nv = 0;
for (var name, $name = this.dataValues.keySet().iterator (); $name.hasNext()&& ((name = $name.next ()) || true);) info[1] += (nv++ > 0 ? "\n" : "") + name;

return info;
default:
var data = this.dataValues.get(label);
if (data == null || this.getType(data) != dataType) return null;
if (bsSelected == null) return data[1];
if (data[3] === Integer.$valueOf(3)) {
var fff = data[1];
var fnew = JU.AU.newFloat3(bsSelected.cardinality(), 0);
for (var i = 0, n = fff.length, p = bsSelected.nextSetBit(0); p >= 0 && i < n; p = bsSelected.nextSetBit(p + 1)) {
fnew[i++] = (p < fff.length ? fff[p] : null);
}
return fnew;
} else if (data[3] === Integer.$valueOf(2)) {
var ff = data[1];
var fnew = JU.AU.newFloat2(bsSelected.cardinality());
for (var i = 0, n = ff.length, p = bsSelected.nextSetBit(0); p >= 0 && i < n; p = bsSelected.nextSetBit(p + 1)) fnew[i++] = (p < ff.length ? ff[p] : null);

return fnew;
}var f = data[1];
var fnew =  Clazz.newFloatArray (bsSelected.cardinality(), 0);
for (var i = 0, n = f.length, p = bsSelected.nextSetBit(0); p >= 0 && i < n; p = bsSelected.nextSetBit(p + 1)) fnew[i++] = (p < f.length ? f[p] : 0);

return fnew;
}
}, "~S,JU.BS,~N");
Clazz.overrideMethod(c$, "deleteModelAtoms", 
function(firstAtomIndex, nAtoms, bsDeleted){
if (this.dataValues.size() == 0) return;
for (var name, $name = this.dataValues.keySet().iterator (); $name.hasNext()&& ((name = $name.next ()) || true);) {
if (name.indexOf("property_") == 0) {
var obj = this.dataValues.get(name);
JU.BSUtil.deleteBits(obj[2], bsDeleted);
obj[1] = JU.AU.deleteElements(obj[1], firstAtomIndex, nAtoms);
}}
}, "~N,~N,JU.BS");
Clazz.overrideMethod(c$, "getDefaultVdwNameOrData", 
function(type, bs){
var sb =  new JU.SB();
sb.append(type.getVdwLabel()).append("\n");
var isAll = (bs == null);
var i0 = (isAll ? 1 : bs.nextSetBit(0));
var i1 = (isAll ? JU.Elements.elementNumberMax : bs.length());
for (var i = i0; i < i1 && i >= 0; i = (isAll ? i + 1 : bs.nextSetBit(i + 1))) sb.appendI(i).appendC('\t').appendF(type === J.c.VDW.USER ? this.vwr.userVdws[i] : JU.Elements.getVanderwaalsMar(i, type) / 1000).appendC('\t').append(JU.Elements.elementSymbolFromNumber(i)).appendC('\n');

return (bs == null ? sb.toString() : "\n  DATA \"element_vdw\"\n" + sb.append("  end \"element_vdw\";\n\n").toString());
}, "J.c.VDW,JU.BS");
Clazz.overrideMethod(c$, "getDataState", 
function(sc, sb){
if (this.dataValues.size() == 0) return false;
var haveData = false;
for (var name, $name = this.dataValues.keySet().iterator (); $name.hasNext()&& ((name = $name.next ()) || true);) {
if (name.indexOf("property_") == 0) {
var obj = this.dataValues.get(name);
if (obj.length > 4 && !(obj[4]).booleanValue()) continue;
haveData = true;
var data = obj[1];
if (data != null && this.getType(obj) == 1) {
sc.getAtomicPropertyStateBuffer(sb, 18, obj[2], name, data);
sb.append("\n");
} else {
sb.append("\n").append(JU.Escape.encapsulateData(name, data, -1));
}continue;
}var type = (name.indexOf("data2d") == 0 ? 2 : name.indexOf("data3d") == 0 ? 3 : -1);
if (type == -1) continue;
var obj = this.dataValues.get(name);
var data = obj[1];
if (data != null && this.getType(obj) == type) {
haveData = true;
sb.append("\n").append(JU.Escape.encapsulateData(name, data, type));
}}
return haveData;
}, "JV.JmolStateCreator,JU.SB");
Clazz.overrideMethod(c$, "createFileData", 
function(strModel){
var o =  new Array(4);
o[0] = "model";
o[1] = strModel;
o[3] = Integer.$valueOf(0);
return o;
}, "~S");
});
;//5.0.1-v7 Mon Oct 26 17:21:26 CDT 2026
