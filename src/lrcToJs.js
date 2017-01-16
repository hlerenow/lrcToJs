/**
 * 将歌词文本转化为js变量
 * @param  {[string]} lrc [歌词字符串]
 * @return {[type]}     [description]
 */
var lrcToJs=function(lrc){
    "use strict";

    /**
     * 将lrc的时间转化为毫秒
     * @param strTime
     */
    var timerToSencond=function(strTime){

        var tp = strTime.match(/([0-9]+?):([0-9]+?)\.([0-9]+?)/);
        //console.log(strTime);
        //console.log(tp[1]);
        var timeSencond=parseInt(tp[1])*60*1000+parseInt(tp[2])*1000+parseInt(tp[3]);

        return timeSencond;
    };

	var returnHandle=function(lrc){
        //未处理的歌词文本
		this._sourceCode=lrc;

        //初始化状态
        this._init=false;

        //歌曲信息字段
		this._tagField={};

        //歌词信息字段
		this._lrcFiled={};

        //歌词信顺序
        this._lrcOrder=[];

	};

    //获取歌词内容数组
    returnHandle.prototype.getLrcFiled=function(){
        return this._lrcFiled;
    };

    //获取歌词内容时间顺序数组
    returnHandle.prototype.getLrcOrder=function(){
        return this._lrcOrder;
    };

    //获取歌曲信息or歌手信息
    returnHandle.prototype.getTagFiled=function(){
        return this._tagField;
    };

    //格式化歌词
    returnHandle.prototype.initLrc = function() {

        //console.log(this.sourceCode);
        // var moreTag=this.sourceCode.match(/\[(\S+):([^0-9]\S*)\]/gi);
        var i = 0,
            j = 0; //用于for循环计数
        var temp = "";

        //用于存储第一次正则匹配后特殊标签的的结果
        var moreTag = this._sourceCode.match(/\[(\S+?):([^0-9]\S*?)\]/ig);

        //用于储存一次正则匹配后歌词内容的结果
        var lrc_time_content = this._sourceCode.match(/\[[0-9\.:\[\]]+\][^\[\]]*/ig);

        //如果歌词没有额外标签，默认为空
        moreTag=moreTag||[];

        //      将歌词信息字段写入tagField
        for (i = 0; i < moreTag.length; i = i + 1) {
            temp = moreTag[i].match(/\[(\S*):(\S*)\]/);
            this._tagField[temp[1]] = temp[2];
        }

        //      console.log(this.tagField);
        //        将歌词顺序写入lrcOrer;
        //        将每句歌词写入lrcFiled
        for (i = 0; i < lrc_time_content.length; i = i + 1) {
            temp = lrc_time_content[i].match(/(\[[0-9\.:\[\]]+\])(.*)/);
            //console.log(temp[1]+"5");

            var temp1 = temp[1].split("[").join("]").split("]");
            for (j = 1; j < temp1.length; j = j + 1) {
                if (temp1[j] !== "") {
                    var lrcOderTemp = timerToSencond(temp1[j]);
                    this._lrcOrder.push(lrcOderTemp);
                    this._lrcFiled["t" + lrcOderTemp] = temp[2];
                    //console.log(temp1);
                }
            }
        }

        //        console.log(this.lrcFiled);
        //        将歌词排序
        this._lrcOrder = this._lrcOrder.sort(function sortNumber(a, b) {
            return a - b;
        });
        //        修改初始化值
        this._init = true;
        //        console.log(this.lrcOrder);
        return this;

    };
	return new returnHandle(lrc);
};

