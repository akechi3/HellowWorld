/**
 * <p>
 * ログ出力クラス
 * </p>
 * ブラウザのコンソールにログを出力します。<br />
 * 使い方（通常）<br />
 * 
 * <pre>
 * Logger.info('出力メッセージ');
 * </pre>
 * 
 * <br/> ストップウォッチ<br />
 * 
 * <pre>
 * Logger.stopWatch.start();
 * Logger.stopWatch.lap('ラップメッセージ');
 * Logger.stopWatch.stop('完了メッセージ');
 * </pre>
 * 
 * <br/>
 * 
 * @class
 */
var Logger = {
	/**
	 * エラーレベル
	 * 
	 * @readonly
	 * @enum {number}
	 */
	LEVEL : {
		/**
		 * <code>ALL</code>はすべてのメッセージのログを取ることを示します。
		 */
		ALL : 0,
		/**
		 * <code> 
		 */
		TRACE : 1,
		DEBUG : 2,
		INFO : 3,
		WARN : 4,
		ERROR : 5,
		FATAL : 6,
		/**
		 * <code>OFF</code>はロギングをオフにするために使われる特殊なレベルです。
		 */
		OFF : 9,
	},
	logLevel : 2,
	className : '',
	methodName : '',
	/**
	 * タイム測定
	 * 
	 * @namespace
	 */
	stopWatch : {
		_startTimer : undefined,
		_lapTime : undefined,
		/**
		 * ストップウォッチ（START）
		 * 
		 * @function
		 */
		start : function() {
			Logger.stopWatch._startTimer = new Date();
		},
		/**
		 * ストップウォッチ（LAP）
		 * 
		 * @function
		 * @param message
		 *            出力メッセージ
		 */
		lap : function(message) {
			var currentTime = new Date();

			var totalTime = currentTime - Logger.stopWatch._startTimer;
			var laptime = '初回測定';
			if (Logger.stopWatch._lapTime != undefined) {
				laptime = currentTime - Logger.stopWatch._lapTime;
			}

			console.log(message + ' 全体経過時間 - ' + totalTime + 'ms経過  前回との差分 - '
					+ laptime + 'ms');
			Logger.stopWatch._lapTime = currentTime;
		},
		/**
		 * ストップウォッチ（STOP）
		 * 
		 * @function
		 * @param message
		 *            出力メッセージ
		 */
		stop : function(message) {
			var currentTime = new Date();
			console.log(message + ' 経過時間 - '
					+ (currentTime - Logger.stopWatch._startTimer) + 'ms経過');
		}
	},
	trace : function() {
		if (Logger.logLevel <= Logger.TRACE) {
			console.log(Logger._getMessage('TRACE', arguments));
		}
	},
	debug : function() {
		if (Logger.logLevel <= Logger.DEBUG) {
			console.log(Logger._getMessage('DEBUG', arguments));
		}
	},
	info : function() {
		if (Logger.logLevel <= Logger.INFO) {
			console.log(Logger._getMessage('INFO', arguments));
		}
	},
	warn : function() {
		if (Logger.logLevel <= Logger.WARN) {
			console.log(Logger._getMessage('WARN', arguments));
		}
	},
	error : function() {
		if (Logger.logLevel <= Logger.ERROR) {
			console.log(Logger._getMessage('ERROR', arguments));
		}
	},
	fatal : function() {
		if (Logger.logLevel <= Logger.FATAL) {
			console.log(Logger._getMessage('FATAL', arguments));
		}
	},
	/**
	 * ログに出力するためのメッセージを構築するローカルメソッド
	 * 
	 * @private
	 * @function
	 * @param arguments
	 *            置換文字列
	 */
	_getMessage : function(level, arguments) {
		var message = dateFormat(new Date()) + ' ' + level + ' ';
		if (this.className) {
			message = message + '[' + this.className + '] ';
		}

		// 呼び出されたメソッド名をログに出力します。
		if (this.methodName) {
			message = message + '(' + this.methodName + ') ';
		}

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
	},
	/**
	 * スタックとレース情報の出力
	 * 
	 * @function
	 * @param e
	 */
	printStackTrace : function(e) {
		if (e.stack) {
			console.log(e.stack);
		} else {
			console.log(e.message, e);
		}
	}
};