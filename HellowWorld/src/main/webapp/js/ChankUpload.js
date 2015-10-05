/**
 * アップロードモジュール
 * @midule ChankAjaxUpload
 * @version 1.0
 * @author akechi
 */

/**
 * 分割アップロードクラス
 * <p>
 * 分割アップロードを可能とするため、大容量のファイルにも対応できるようになります。<br />
 * File APIを利用しているためHTML5対応ブラウザ必須です。
 * <br />
 * サーバ側のアップロードモジュールは別途<br />
 * 
 * @namespace
 */
var ChankAjaxUpload = {
		/**
		 * 動作オプション
		 * @namespace
		 */
		option: {
			/** 
			 * アップロード送信先URL
			 * @type {String}	 
			 */
			url: './api/JaxRsSample/upload',
			/**
			 * ファイル分割単位(単位byte)
			 * @type {number}
			 */
			chankFileSize: 10,
			/**
			 * ファイルサイズの上限
			 * デフォルトは1Gbyte
			 */
			maxFileSize:1000000000,
		},
		/**
		 * 処理ステータス
		 * @namespace
		 * @private
		 */
		_status: {
			/**
			 * ファイルに関する情報
			 * @namespace
			 */
			_file: {
				/**
				 * ファイル名
				 * @type {number}
				 */
				_name: '',
				/**
				 * ファイルサイズ
				 * @type {number}
				 */
				_size: 0,
				_type: '',
				/**
				 * 分割個数
				 * @type {number}
				 */
				_ChankTotal: 0,
				/**
				 * 現在の読み込み位置
				 */
				_readPos : 0,
				_requestCount: 0,
			},
		},
		/**
		 * アップロード対象ファイル
		 */
		_file: null,
}

/**
 * ファイル送信開始
 * 
 */
ChankAjaxUpload.send = function(file) {

	// File APIに対応しているかどうかチェックする。
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
	} else {
		throw 'The File APIs are not fully supported in this browser.';
	}
	
	// ファイルサイズチェック
	if (file.size > ChankAjaxUpload.option.maxFileSize) {
		throw 'The File Upload limit over.. maxFileSize=' + ChankAjaxUpload.option.maxFileSize;
	}

	ChankAjaxUpload._status._file._readPos = 0;
	ChankAjaxUpload._status._file._requestCount = 0;
	ChankAjaxUpload._status._file._name = file.name;
	ChankAjaxUpload._status._file._size = file.size;
	ChankAjaxUpload._status._file._type = file.type;
	
	ChankAjaxUpload._status._file._ChankTotal = 
		Math.ceil(file.size / ChankAjaxUpload.option.chankFileSize);
	ChankAjaxUpload._file = file;

	ChankAjaxUpload._nextLoad();
}

/**
 * 次の分割ファイル読み込み
 * 
 */
ChankAjaxUpload._nextLoad = function() {

	var endPos = ChankAjaxUpload._status._file._readPos + ChankAjaxUpload.option.chankFileSize;
	var eof = false;
	if (endPos > ChankAjaxUpload._status._file._size) {
		endPos = ChankAjaxUpload._status._file._size;
		eof = true;
	}
	
	var blob;
	// chank可能なAPIを保持しているかチェック
	if (ChankAjaxUpload._file.slice) {
		blob = ChankAjaxUpload._file.slice(ChankAjaxUpload._status._file._readPos, endPos);
	} else if(ChankAjaxUpload._file.webkitSlice) {
		blob = ChankAjaxUpload._file.webkitSlice(ChankAjaxUpload._status._file._readPos, endPos);
	} else if (ChankAjaxUpload._file.mozSlice) {
		blob = ChankAjaxUpload._file.mozSlice(ChankAjaxUpload._status._file._readPos, endPos);
	} else {
		throw 'The File APIs are not Slice supported in this browser.';
	}

	// ファイルの分割開始
	var fileReader = new FileReader();

	// ファイル読み込み後のイベント処理にて、アップロード要求を実施する。
	fileReader.onloadend = function(evt) {
		// ステータスチェック
		if (evt.target.readyState == FileReader.DONE) { // DONE == 2
			ChankAjaxUpload._status._file._readPos = endPos; 
			ChankAjaxUpload._sendServer(evt.target.result, eof);
		}
	} 
	
	fileReader.readAsBinaryString(blob);
}

/**
 * Ajaxによりサーバへアップロードする。
 * @param uploadData アップロード対象ファイル
 */
ChankAjaxUpload._sendServer = function(uploadData, eof) {
    var xhr = new XMLHttpRequest;

    xhr.open("POST", ChankAjaxUpload.option.url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {		// すべてのデータを受信済みの場合
        	if (xhr.status == 200) {
	        	if (!eof) {
	        		ChankAjaxUpload._status._file._requestCount++;
	        		ChankAjaxUpload._nextLoad();
	        	}
        	}
        }
		// とりあえず直接エラー処理を記述
		console.log("http resphonse error = " + xhr.status);
    };

//    var contentType = "multipart/form-data; boundary=" + 
//    	"AJAX--------------" + (new Date).getTime();;
//    xhr.setRequestHeader("Content-Type", contentType);
    for (var header in this.headers) {
		xhr.setRequestHeader(header, headers[header]);
    }

    // アップロードの順序を指定する。
    xhr.setRequestHeader("index", ChankAjaxUpload._status._file._requestCount);

    var formData = new FormData();
    formData.append("file", uploadData);
    formData.append("filename", ChankAjaxUpload._status._file._name);

    xhr.send(formData);
}



