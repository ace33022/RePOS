/**
 *
 * Configuratons
 *
 * @author ace
 *
 * @version 2013/10/15 初始版本。
 * @version 2015/02/25 新增JSLibPath。
 * @version 2015/03/03 新增AcePath。
 * @version 2015/03/03 新增VOPath。
 * @version 2015/03/03 新增DAOPath。
 * @version 2015/03/03 新增DelphiBaseDir。
 * @version 2015/03/11 新增TempDir。
 *
 * @see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof">typeof - JavaScript | MDN</a>
 *
 * @description 執行環境設定。
 * 
 */
 
(function(root) {

	var result;
	
	var Database = function() {

		var conn;
  
    var DBDRIVER = 'org.sqlite.JDBC';
    var DBURL = 'jdbc:sqlite:' + 'K:/ReStock/db/SQLite/base.sqlite3';
  
    var DBUSER = '';
    var DBPASSWORD = '';
  
    var properties = new java.util.Properties();
    
    java.lang.Class.forName(DBDRIVER);
    conn = java.sql.DriverManager.getConnection(DBURL, DBUSER, DBPASSWORD); 
		
		this.getConnection = function() { return conn; }
		this.close = function() { if (conn != null) conn.close(); }
  
		return this;
	}
	
	if (typeof Packages != 'undefined') {

		// Rhino執行環境
			
		if (Packages.java.lang.System.getProperty('JSLibDir') == null) throw new Error('JSLibDir is undefined!');
		print('JSLibDir:' + Packages.java.lang.System.getProperty('JSLibDir'));
			
		print('load NameSpace...');
		load(Packages.java.lang.System.getProperty('JSLibDir') + '/tw/ace33022/NameSpace.js');
			
		print('load DefaultConfigurations...');
		load(Packages.java.lang.System.getProperty('JSLibDir') + '/tw/ace33022/DefaultConfigurations.js');
	}
	
	if (typeof process != 'undefined') {
	
		// nodeJS執行環境
		
		if (typeof nw != 'undefined') {
		
			// NW.js執行環境
			
			result = require(process.env.NODE_PATH + '/' + 'tw/ace33022/DefaultConfigurations.js');
		}
		else {
		
			result = require('tw/ace33022/DefaultConfigurations.js');
		}
	}
	else {
		
		if (typeof root.tw == 'undefined') throw new Error('NameSpace is undefined!');
		if (typeof root.tw.ace33022.DefaultConfigurations == 'undefined') throw new Error('DefaultConfigurations is undefined!');
		
		result = root.tw.ace33022.DefaultConfigurations;
	}
	
	result['Database'] = function() {return null;};

	if (typeof process != 'undefined') {
	
		// nodeJS執行環境
		
		if ((typeof nw != 'undefined') && (typeof module == 'undefined')) {
		
			// NW.js執行環境
			
			// 採用HTML標籤引入資料時不會有module物件。
			root.Configurations = result;
		}
		else {
		
			module.exports = result;
		}
	}
	else {
	
		root.Configurations = result;
	}
	
	if (typeof Packages != 'undefined') load(root.Configurations.JSLibDir + '/tw/ace33022/util/Rhino/InitEnv.js');
})(this);