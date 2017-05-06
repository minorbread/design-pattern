
//属性检查模仿接口
/*
	interface Composite{
		function add(Child);
		function remove(Child);
		function getChild(Child);
	}

	interface FormItem{
		function save();
	}
*/
var CompositeForm = function  (id,method,action) {
	this.implementsInterfaces = ['Composite','FormItem'];
};

function addForm (formInstance) {
	if (!implements(FormItem,'Composite','FormItem')) {
		throw new Error("Object does not implement a required interface.");
	}
}

function implements (object) {
	for(var i=1;i < arguments.length;i++){

		var interfaceName = arguments[i];
		var interfaceFound = false;
		for(var j=0;j < object.implementsInterfaces.length;j++){
			if (object.implementsInterfaces[j] == iterfaceName) {
				interfaceFound = true;
				break;
			}
		}
		if(!interfaceFound){
			return false;
		}
	}
	return true;
}

//鸭式遍型 设计模式提供

// eg
	var Composite = new Interface('Compopsite',['add','remove','getChild']);
	var FormItem = new Interface('FormItem',['save']);

	var CompositeForm = function  (id,method,action) {
		// ...
	};

	function addForm (formInstance) {
		Interface.ensureImplements(formInstance,Composite,FormItem);
	}


	var Interface = function  (name,methods) {
		if (arguments.length != 2) {
			throw new Error("Interface constructor called with" + arguments.length + "arguments ,but expected exactly 2.");
		}

		this.name = name;
		this.methods = [];
		for(var i=0,len=methods.length;i<len;i++){
			if (typeof methods[i] !== "string") {
				throw new Error("Interface constructor expects method names to be" + "passed in as a string");
			}
			this.methods.push(methods[i]);
		}
	};

	Interface.ensureImplements = function  (object) {
		if (arguments.length < 2) {
			throw new Error("Function Interface.ensureImplements call with" + arguments.length + "arguments ,but expected exactly 2.");
		}

		for(var i=1,len = arguments.length;i < len;i++){
			var interface = arguments[i];
			if (interface.constructor !== Interface) {
				throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface.");
			}

			for(var j=0,methodsLen = interface.methods.length;j < methodsLen;j++){
				var method = interface.methods[j];
				if (!object[method] || typeof object[method] !== 'function') {
					throw new Error("Function Interface.ensureImplements: object" + "does not implement the " + interface.name + "interface.Method" + method + "was not found.");
				}
			}
		}
	};


//创建对象的基本模式
// 门户大开型对象：属性和方法都是公开的，可访问的，共用属性用this创建
// 利:派生子类和进行单元测试容易
// 弊:无法保护内部数据，取值器与赋值器的引入增加了文件大小
// 
//eg 书类存储
	var Book = function  (isbn,title,author) {
		// if(!this.checkIsbn(isbn)) throw new Error('Book: Invalid ISBN.');
		// this.isbn = isbn;
		// this.title = title || 'No title speccified';
		// this.author = author || 'No author specified';
		// 使用取值器和赋值器方法保护内部数据 但仍可以被直接设置
		this.setIsbn(isbn);
		this.setTitle(title);
		this.setAuthor(author);
	};

	Book.prototype = {
		// 参数检测 数据完整性检查 &&方法和属性名称前加_表私有 并且直接访问或设置可能会发生错误 适用于非敏感性的内部方法和属性
		_checkIsbn: function  (isbn) {
			if(isbn === "undefine" || typeof isbn != 'string'){
				return false;
			}

			isbn = isbn.replace(/-/,"");
			if(isbn.length != 10&&isbn.length != 13){
				return false;
			}

			var sum = 0;
			if (isbn.length === 10) {
				if (!isbn.match(/^\d{9}/)) {
					return false;
				}
				for(var i=0;i < 9;i++){
					sum += isbn.charAt(i)*(10 - i);
				}
				var checksum = sum%11;
				if (checksum === 10) {
					checksum = 'X';
				}
				if(isbn.charAt(9) != checksum){
					return false;
				}
			}else{
				if (!isbn.match(/^\d{12}/)) {
					return false;
				}

				for(var i = 0;i < 12;i++){
					sum += isbn.charAt(i)*((i%2 === 0)?1:3);
				}
				var checksum = sum % 10;

				if (isbn.charAt(12)!=checksum) {
					return false;
				}
			}
			return true;
		},
		// 取值器方法 &&方法和属性名称前加_表私有 并且直接访问或设置可能会发生错误
		getIsbn: function  () {
			return this._isbn;
		},
		getTitle: function  () {
			return this._title;
		},
		getAuthor: function  () {
			return this._author;
		},
		// 赋值器方法 &&方法和属性名称前加_表私有 并且直接访问或设置可能会发生错误
		setIsbn: function  (isbn) {
			if(!this.checkIsbn(isbn))throw new Error('Book: Invalid ISBN.');
			this._isbn = isbn;
		},
		setTitle: function  (title) {
			this._title = title || "No title specified";
		},
		setAuthor: function  (author) {
			this._author = author || "No Author specified";
		},

		display: function  () {
			// body...
		}

	};
// 闭包实现私有成员
	var Book = function  (newIsbn,newTitle,newAuthor) {
		
		// Private attribute.私有属性或方法
		var isbn,title,author;

		// Private method.私有属性或方法
		function checkIsbn () {
			// body...
		}
		// Privileged methods 需要访问的函数和变量 也称特权方法 其
		// 具有真正的私有属性
		// 弊:太多占用内存 每个实例会产生其新副本 不利于派生子类
		this.getIsbn = function  () {
			return isbn;
		};
		this.setIsbn = function  (newIsbn) {
			if (!checkIsbn(newIsbn)) {
				throw new Error('Book: Invalid ISBN.');
			}
				isbn = newIsbn;
		};
		this.getTitle = function  () {
			return title;
		};
		this.setTitle = function  (newTitle) {
			title = newTitle || 'No title specified';
		};
		this.getAuthor = function  () {
			return author;
		};
		this.setAuthor = function  (newAuthor) {
			author = newAuthor || 'No title specified';
		};

		this.setIsbn(newIsbn);
		this.setTitle(newTitle);
		this.setAuthor(newAuthor);
	};
	// 不需要访问私有属性的方法在此声明
	Book.prototype =  {
		display: function  () {
			// body...
		},
	};

	// 静态方法和属性

	var Book = (function  () {
		
		//Private static attributes.	
		var numOfBooks = 0;

		//Private stative method.看是否需要访问任何实例数据来设置静态方法 不需要则为静态方法
		function checkIsbn (isbn) {
			// body...
		}

		//Return the constructor.
		return function  (newIsbn,newTitle,newAuthor) {	//implements Publication
			

			//Private attributes.私有成员和特权成员仍被声明在构造器中
			var isbn,title,author;

			//Privileged methods.
			this.getIsbn = function  () {
				return isbn;
			};
			this.setIsbn = function  (newIsbn) {
				if(!checkIsbn(newAuthor)){
					throw new Error("Book: Invalid ISBN.");
				}
				isbn = newIsbn;
			};
			this.getTitle = function  () {
				return title;
			};
			this.setTitle = function  (newTitle) {
				title = newTitle || 'No title specified.';
			};
			this.getAuthor = function  () {
				return author;
			};
			this.setAuthor = function  (newAuthor) {
				author = newAuthor || 'No author specified.';
			};

			// Constructor code
			numOfBooks++;//Keep track of how many Books have been instantiated & with the private static attribute.
			if (numOfBooks > 50) {
				throw new Error('Book: Only 50 instances of Book can be' + " created");
			}
			this.setIsbn(newIsbn);
			this.setTitle(newTitle);
			this.setAuthor(newAuthor);
		};
	})();

	//Public static method.
	Book.convertToTitleCase = function  (inputString) {
		// body...
	};

	//Public static methods.
	Book.prototype = {
		display: function  () {
			// body...
		}
	};

	// 常量 创建只有取值器而没有赋值器的私有变量

	var Class = (function  () {
		
		// Constants (created as private static attributes) 特权静态方法
		// var UPPER_BOUND = 100;

		// 通用取值器
		var constants = {
			UPPER_BOUND: 100,
			LOWER_BOUND: -100
		};
		// Constrcuctor
		var ctor = function  (constructorArgument) {
			// body...
		};

		// ctor.getUPPER_BOUND = function  () {
		// 	return UPPER_BOUND;
		// }
		ctor.getConstant = function  (name) {
			return constants[name];				//Class.getContants('UPPER_BOUND');
		};
		//Return the constrcutor
		return ctor;
	}) ();

// 继承
	/*Class Person原型链继承*/ 
	function Person (name) {
		this.name = name;
	}

	Person.prototype.getName = function  () {
		return this.name;
	};

	/*Class Author*/ 

	function Author (name,book) {
		Person.call(this,name);		//Call the superclass's constructor in the scope of this.调用超类函数
		/*弱化耦合
			Author.superclass.constructor.call(this,name);
		*/ 
		this.books = books;
	}

	Author.prototype = new Person();				//可被extend(Author,Person)取代		
	Author.prototype.constructor = Author;			//可被extend(Author,Person)取代
	Author.prototype.getBooks = function () {
		return this.books;
	};

	/*重设Person方法
	Author.prototype.getName = function(){
		var name = Author.superclass.getName.call(this);
		return name + 'Author of' + this.getBooks().join(',');
	}
	*/

	// extend函数

	function extend (subClass,superClass) {
		var F = function  () {};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass; 

		/*superClass属性 作用弱化耦合*/
		subClass.superclass = superClass.prototype;
		if (superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
	}

// 原型式继承
	function clone (object) {
		function F () {}
		F.prototype = object;
		return new F();
	}

	var Person = {
		name: 'default name',
		getName: function  () {
			return this.name;
		}
	};

	var reader = clone(Person);

	alert(reader.getName());
	reader.name = "GuoQuan";
	alert(reader.getName());

	/*Author Prototype Object*/
	var Author = clone(Person);
	Author.books = [];
	Author.getBooks = function () {
		return this.books;
	};


	var authorClone = clone(Author);
	alert(authorClone.name);

	authorClone.name = 'new name';

	alert(authorClone.name);

	authorClone.books.push('new book');//★★★★★引用类型必须创立新副本 否则该修改会直接修改父类 影响所有未声明此方法的对象 hasOwnporterty

	authorClone.books = [];

	authorClone.books.push('new book');

//原型式含有自己的子对象时有方法构造类 原因如果想覆盖其子对象中的一个属性值，你不得不重新定义子对象(内对象的强耦合)
// eg工厂方法
	var CompoundObject = {};
	CompoundObject.string1 = 'default name';
	CompoundObject.createChildObject = function  () {
		return {
			bool: true,
			num: 10
		};
	};

	CompoundObject.childObject = CompoundObject.createChildObject();

	var compoundObjectClone = clone(CompoundObject);
	compoundObjectClone.childObject = CompoundObject.createChildObject();
	compoundObjectClone.createChildObject.num = 5;	


// 掺元类：先创建一个包含各种通用方法的类，然后再用它扩充其他类 实现子类继承超类

	function augment (receivingClass,givingClass) {//用for in 循环访遍予类givingClass的prototype中的每一个成员，并添加到受类receivingClass的prototype中 存在则跳过
		if (arguements[2]) {
			for(var i=0, len = arguements.length;i<len;i++){
				receivingClass.prototype[argument[i]] = givingClass.prototype[arguments[i]];
			}
		} else{
			for(var methodName in givingClass.prototype){
				if (!receivingClass.prototype[methodName]) {
					receivingClass.prototype[methodName] = givingClass.prototype[methodName];
				}
			}
		}
	}

// eg
	var Mixin = function  () {};
	Mixin.prototype = {
		serialize: function  () {
			var output = [];
			for(var key in this){
				ouput.push(key + ':' + this[key]);
			}
			return output.join(',');
		}
	};


	augment(Author,Mixin);
	var author = new Author('Ross Harmes',['JavaScript Design Patterns']);
	var serializedString = author.serialize();


// 单体模式 :简单的单体 一批有一定关联的方法和属性组织在一起
	
	var Singleton = {
		attribute1: true,
		attribute2: 10,
		method1: function  () {
			
		},
		method2:function  () {
			
		}
	};
	var attribute1 = false;//不会引起冲突

	/*GiantCorp namespace.*/
	var GiantCorp = {};

	GiantCorp.Common = {
		// A singleton with common methods used by all objects and modules.
	};
	GiantCorp.Error = {
		//An object literal used to store data.
	};
	GiantCorp.PageHandler = {
		//An singleton with page specific methods and attributes.
	};

	/////////////////////////////////////////////////////////////////////////
	// 包装特定网页专用代码的单体的骨架
	Namespace.PageName = {

		//Page contants,
		method1: function  () {
			
		},
		method2: function  () {
			
		},
		//Initialization method.
		init: function  () {
			
		}

	};
	addLoadEvent(Namespace.PageName.init);

	/////////////////////////////////////////////////////////////////////////
	//拥有私有成员的单体 伪

	GiantCorp.DataParser = {
		//Private methods.
		_stripWhitespace:function  (str) {
			return str.replace(/\s+/,"");
		},
		_stringSplit: function  (str,delimiter) {
			return str.split(delimiter);
		},

		//Public methods
		stringToarray: function  (str,delimiter,stripWS) {
			if (stripWS) {
				str = GiantCorp.DataParser._stripWhitespace(str);					//由于this的指向可能改变 eg用做事件监听器 所以改为全名更保险
			}
			var outputArray = GiantCorp.DataParser._stringSplit(str,delimiter);		//由于this的指向可能改变 eg用做事件监听器 所以改为全名更保险			
			return outputArray;
		},
	};

	//真 使用闭包 又称模块模式即把一批相关属性和方法组织为模块并起到划分命名空间作用
	/*Singleton as an Object Literal.*/

	// MyNamespace.Singleton = {};	之前

	/*Singleton with Private Members,step 1.*/// 分3步 1定义立即执行的函数创建单体

	MyNamespace.Singleton = (function  () {
		return {};
	})();

	//Singleton with Private Members,step 2.公有成员成员添加到作为单体返回的那个对象字面量中
	//
	//加外层函数原因：包装函数创建了一个可以用来添加真正的私用成员的闭包
	//任何声明在匿名函数中的变量和函数都只能被在同一个闭包中声明的其他函数访问？
	//这个闭包在内部函数执行结束后依然存在，所以在其中声明的函数和变量总能从匿名函数所返回的对象内部访问
	//
	MyNamespace.Singleton = (function  () {
		return { //Public member
			publicAttribute1: true,
			publicAttribute2: 10,

			publicMethod1: function  () {
				// body...
			},

			publicMethod2: function  () {
				// body...
			}
		};
	})();


	// Singleton with Private Members,step 3
	MyNamespace.GiantCorp = (function  () {

		var privateAttribute1 = false;
		var privateAttribute2 = [1,2,3];
		function privateMethod1 () {
			// body...
		}
		function privateMethod2 (args) {
			// body...
		}

		return {
			publicAttribute1: true,
			publicAttribute2: 10,
			publicMethod1: function  () {
				// body...
			},
			publicMethod2: function  (args) {
				// body...
			},
		};
	})();
	// 惰性实例化：将实例化推迟到需要使用它的时候 访问必须借助于一个静态方法

	// 普通单体的3步转换成惰性实例 Step1

	MyNamespace.Singleton = (function  () {
		
		function constructor () { // All of the normal singleton code goes here.
			//Private members.
			var privateAttribute1 = false;
			var privateAttribute2 = [1,2,3];
			function privateMethod1 () {
				// body...
			}
			function privateMethod2 (args) {
				// body...
			}
			return {
				publicAttribute1: true,
				publicAttribute2: 10,
				publicMethod1: function  () {
					// body...
				},
				publicMethod2: function  (args) {
					// body...
				}
			};
		}
	})();

	// 普通单体的3步转换成惰性实例 Step2
	MyNamespace.Singleton = (function  () {
		function constructor () {
			// body...
		}
		return {
			getInstance: function  () {
				//Control code goes here
			}
		};
	})();

	// 普通单体的3步转换成惰性实例 Step3

	MyNamespace.Singleton = (function  () {

		var uniqueInstance;// Private attribute that holds the single instance

		function constructor () {
			// body...
		}
		return {
			getInstance: function  () {
				if (!uniqueInstance) { //Instantiate only if the instance does't exist
					uniqueInstance = constructor();
				}
				return uniqueInstance;
			}
		};
	})();

	//分支：把浏览器间的差异封装到在运行期间进行设置的动态方法的技术 利用单体对象的所有代码在运行是确定的特性

	// Branching Singleton (skeleton).

	MyNamespace.Singleton = (function  () {
		var objectA = {
			method1: function  () {
				
			},
			method2: function  () {
				
			}
		};
		var objectB = {
			method1: function  () {
				
			},
			method2: function  () {
				
			}
		};
		return (someCondition) ? objectA : objectB;
	})();


// eg：XHR浏览器兼容

	var SimpleXhrFactory = (function  () {
		
		// The three branch
		var standard = {
			createXhrObject: function  () {
				return new XMLHttpRequest();
			}
		};
		var activeXNew = {
			createXhrObject: function  () {
				return new ActiveXObject("Msxml2.XMLHTTP");
			}
		};
		var activeXOld = {
			createXhrObject: function  () {
				return new ActiveXObect('Microsoft.XMLHTTP');
			}
		};

		//To assign the branch,try each method;return whatever does't fail.
		var testObject;
		try{
			testObject = standard.createXhrObject();
			return standard;
		}catch(e){
			try{
				testObject = activeXNew.createXhrObject();
				return activeXNew;
			}catch(e){
				try{
					testObject = activeXOld.createXhrObject();
					return activeXOld;
				}catch(e){
					throw new Error("No XHR object found in this environment");
				}
			}
		}
	})();








































































































































































