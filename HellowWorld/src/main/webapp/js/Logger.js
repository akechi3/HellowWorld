/** 
 * ログ出力用モジュール
 * @module Logger
 * @version 1.0 
 * @author akechi
 */

/**
 * ログ出力クラス
 * @namespace
 */
var Logger = {
	/**
	 * ログレベル
	 * @namespace
	 */
	LEVEL:  {
		/**
		 * <code>ALL</code>はすべてのメッセージを示します。
		 * @type {number}
		 * @static
		 */
		ALL: 0xFF,
		/**
		 * <code>TRACE</code>はトレースレベルのメッセージを示します。
		 * <p>
		 * デバッグに利用します。<code>DEBUG</code>より詳細に動作検証を
		 * 行う場合に利用します。
		 * </p>
		 */
		TRACE: 0x3F,
		TRACE_: 0x20,
		/**
		 * <code>DEBUG</code>はデバッグレベルのメッセージを示します。
		 * デバッグに利用します。
		 */
		DEBUG: 0x1F,
		/**
		 * <p><code>INFO</code>は情報レベルのメッセージを示します。</p>
		 * 処理を受け付けた場合など、実運用で利用します。
		 */
		INFO: 0x0F,
		INFO_: 0x08,
		/**
		 * <p><code>WARN</code>は警告レベルのメッセージを示します。</p>
		 * 何かの問題はあったが、処理が継続できる場合に利用します。
		 */
		WARN: 0x07,
		/**
		 * <p><code>ERROR</code>はエラーレベルのメッセージを示します。</p>
		 * 何かのエラーが生じ、処理の続行が不可能な場合に利用します。
		 */
		ERROR : 0x03,
		/**
		 * <p><code>FATAL</code>は致命的なエラーメッセージを示します。</p>
		 * 想定外の状況で、アプリケーションレベルで処理が続行不可能な場合に利用します。
		 */
		FATAL: 0x01,
		/**
		 * <code>OFF</code>はロギングをオフにするために使われる特殊なレベルです。
		 */
		OFF: 0x00,
	},
	/** 
	 * 現在の出力ログレベル
	 * @private
	 */
	logLevel: 0x3F,
	/**
	 * ログ出力フォーマット
	 */
	LogFormat: '',
};

/**
 * 情報レベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.info = function() {
	if (this.logLevel &= this.LEVEL.INFO_) {
		console.log(this.getMessage_('INFO', arguments.callee.caller, arguments));
	}
};

/**
 * トレースレベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.trace = function() {
	if (this.logLevel &= this.LEVEL.TRACE) {
		console.log(this._getMessage('TRACE', arguments.callee.caller, arguments));
	}
};

/**
 * トレースレベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.debug = function() {
	if (this.logLevel &= this.LEVEL.DEBUG) {
		console.log(this._getMessage('DEBUG', arguments.callee.caller, arguments));
	}
};

/**
 * 情報レベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.info = function() {
	if (this.logLevel &= this.LEVEL.INFO) {
		console.log(this._getMessage('INFO', arguments.callee.caller, arguments));
	}
};

/**
 * 警告レベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.warn = function() {
	if (this.logLevel &= this.LEVEL.WARN) {
		console.log(this._getMessage('WARN', arguments.callee.caller, arguments));
	}
};

/**
 * エラーレベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.error = function() {
	if (this.logLevel &= this.LEVEL.ERROR) {
		console.log(this._getMessage('ERROR', arguments.callee.caller, arguments));
	}
};

/**
 * エラーレベルのログ出力を実施する。
 * @function
 * @static
 * @public
 */
Logger.fatal = function() {
	if (this.logLevel &= this.LEVEL.FATAL) {
		console.log(this._getMessage('FATAL', arguments.callee.caller, arguments));
	}
};

/**
 * ログに出力するためのメッセージを構築するローカルメソッド
 * 
 * @private
 * @function
 * @param arguments
 *            置換文字列
 */
Logger.getMessage_ = function(level, caller, arguments) {
	var message = dateFormat(new Date()) + ' ' + level + ' ';
	if (this.className) {
		message = message + '[' + this.className + '] ';
	}

	// 呼び出されたメソッド名をログに出力します。
	if (this.methodName) {
		message = message + '(' + this.methodName + ') ';
	}
	
	message = message + ' ' + caller + ' ';

	// 引数を分析
	switch (arguments.length) {
	case 0:
		// メッセージが存在しない。
		message = message + 'no message!!';
		break;
	case 1:
		message = message + arguments[0];
	default:
		// @TODO これから作成（）
	}
	return message;
};

/**
 * 日付をフォーマットする
 * 
 * @param {Date} date 日付
 * @param {String} [format] フォーマット
 * @return {String} フォーマット済み日付
 */
function dateFormat(date, format) {
	if (!format)
		format = 'YYYY-MM-DD hh:mm:ss.SSS';
	format = format.replace(/YYYY/g, date.getFullYear());
	format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
	format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
	format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
	format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
	format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
	if (format.match(/S/g)) {
		var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
		var length = format.match(/S/g).length;
		for (var i = 0; i < length; i++)
			format = format.replace(/S/, milliSeconds.substring(i, i + 1));
	}
	return format;
}



