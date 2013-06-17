//1. initialization

var localDB = null;

function onInit(){
    try {
        if (!window.openDatabase) {
            updateStatus("Error: DB not supported");
        }
        else {
            initDB();
            createTables();
            queryAndUpdateOverview();
        }
    } 
    catch (e) {
        if (e == 2) {
            updateStatus("Error: Invalid database version.");
        }
        else {
            updateStatus("Error: Unknown error " + e + ".");
        }
        return;
    }
}

function initDB(){
    var shortName = 'db';
    var version = '1.0';
    var displayName = 'db';
    var maxSize = 9999999; // in bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}


//Funtion to Create Tables
/*function createTables(slqQuery, tbName){
    var query = slqQuery;
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            updateStatus("Table '"+tbName+"' is present");
        });
    } 
    catch (e) {
        updateStatus("Error: Unable to create table '"+tbName+"' " + e + ".");
        return;
    }
}
var query = 'CREATE TABLE IF NOT EXISTS items(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, amount VARCHAR NOT NULL, name VARCHAR NOT NULL);';


var queries = [];
queries = 'CREATE TABLE IF NOT EXISTS Customer (CustomerID INTEGER PRIMARY KEY  NOT NULL, PartyID INTEGER, CustomerKey TEXT, CreateDate TEXT, OrganizationName TEXT, FederalTaxID TEXT, KeyFederalTaxID INTEGER, PersonalIDNumber TEXT, SalesManID INTEGER, ZoneID INTEGER, PaymentID INTEGER, TenderID INTEGER, CarrierID INTEGER, EmailAddress TEXT, Telephone1 TEXT, Telephone2 TEXT, Telephone3 TEXT, Telephone4 TEXT, MobileTelephone1 TEXT, MobileTephone2 TEXT, Fax TEXT, CustomerGroupDescription TEXT, PriceLineID INTEGER, CustomerLevel INTEGER, LastTransSerial TEXT, LastTransDocNumber INTEGER, LastTransDicument TEXT, LimitType INTEGER, LimitPurchaseDays INTEGER, LimitPuchaseValue INTEGER, LimitPurchaseCurrencyID TEXT, LimitPurchaseEchange INTEGER, LimitPurchaseFactor INTEGER, DirectDicount INTEGER, GlobalDiscount INTEGER, Comments TEXT, AplyRetentionTax TEXT, RetentionTax INTEGER, TemporaryID INTEGER, Locked TEXT, CardID TEXT, UseIntraStat TEXT, ActiveParty TEXT, CashDiscountTermID TEXT, TaxablePesonType INTEGER);';
queries = 'CREATE TABLE IF NOT EXISTS CustomerLedgerAccount (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, InternalID INTEGER, ReconciledFlag TEXT, CreateDate TEXT, DeferredPaymentDate TEXT, ContractReferenceNumber TEXT, TransSerial TEXT, TransDocument TEXT, TransDocNumber INTEGER, TransInstallmentID INTEGER, TotalAmount REAL, TotalPendingAmount REAL, OperationID INTEGER, TotalAccountSign INTEGER, BalanceAmount REAL, BalanceAccountSign INTEGER, PartyTypeCode INTEGER, PartyID INTEGER, SalesManID INTEGER, CurrencyID TEXT, CurrencyExchange REAL, CurrencyFactor INTEGER, EschangeDifCurrency REAL, RetentionTotalAmount REAL, RetentionPendingAmount REAL, DebitTotalAmount REAL, CreditTotalAmount REAL, TransStatus INTEGER, LedgerCounter INTEGER, PartyAccountTypeID TEXT, OriginTransSerial TEXT, OriginTransDocument TEXT, OriginTranDocNumber INTEGER, PartyAddressID INTEGER);';
queries = 'CREATE TABLE IF NOT EXISTS Users (ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, AppUserID INTEGER, AppUserName TEXT, AppUserPassword TEXT);';

var key;
for(key in queries){
	createTables(queries[key], key){
}*/

function createTables(){
    var query = 'CREATE TABLE IF NOT EXISTS Users (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, AppUserID INTEGER, AppUserName VARCHAR NOT NULL, AppUserPassword VARCHAR NOT NULL);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            updateStatus("Table 'Users' is present");
        });
    } 
    catch (e) {
        updateStatus("Error: Unable to create table 'Users' " + e + ".");
        return;
    }
}

//2. query db and view update

// event handler start with on*


function onUpdate(){
    var id = document.itemForm.id.value;
    var amount = document.itemForm.amount.value;
    var name = document.itemForm.name.value;
    if (amount == "" || name == "") {
        updateStatus("'AppUserID' and 'AppUserName' are required fields!");
    }
    else {
        var query = "UPDATE Users SET AppUserID=?, AppUserName=? WHERE ID=?;";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [amount, name, id], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatus("Error: No rows affected");
                    }
                    else {
                        updateForm("", "", "");
                        updateStatus("Updated rows:" + results.rowsAffected);
                        queryAndUpdateOverview();
                    }
                }, errorHandler);
            });
        } 
        catch (e) {
            updateStatus("Error: Unable to perform an UPDATE " + e + ".");
        }
    }
}

function onDelete(){
    var id = document.itemForm.id.value;
    
    var query = "DELETE FROM Users WHERE ID=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
                if (!results.rowsAffected) {
                    updateStatus("Error: No rows affected.");
                }
                else {
                    updateForm("", "", "");
                    updateStatus("Deleted rows:" + results.rowsAffected);
                    queryAndUpdateOverview();
                }
            }, errorHandler);
        });
    } 
    catch (e) {
        updateStatus("Error: Unable to perform an DELETE " + e + ".");
    }
    
}

function onCreate(){
    var amount = document.itemForm.amount.value;
    var name = document.itemForm.name.value;
    if (amount == "" || name == "") {
        updateStatus("Error: 'AppUserID' and 'AppUserName' are required fields!");
    }
    else {
        var query = "INSERT INTO Users (AppUserID, AppUserName, AppUserPassword) VALUES (?, ?, '123');";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [amount, name], function(transaction, results){
                    if (!results.rowsAffected) {
                        updateStatus("Error: No rows affected.");
                    }
                    else {
                        updateForm("", "", "");
                        updateStatus("Inserted row with id " + results.insertId);
                        queryAndUpdateOverview();
                    }
                }, errorHandler);
            });
        } 
        catch (e) {
            updateStatus("Error: Unable to perform an INSERT " + e + ".");
        }
    }
}

function onSelect(htmlLIElement){
	var id = htmlLIElement.getAttribute("id");
	
	query = "SELECT * FROM Users where ID=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
            
                var row = results.rows.item(0);
                
                updateForm(row['ID'], row['AppUserID'], row['AppUserName']);
                
            }, function(transaction, error){
                updateStatus("Error: " + error.code + "<br>Message: " + error.message);
            });
        });
    } 
    catch (e) {
        updateStatus("Error: Unable to select data from the db " + e + ".");
    }
   
}

function queryAndUpdateOverview(){

	//remove old table rows
    var dataRows = document.getElementById("itemData").getElementsByClassName("data");
	
    while (dataRows.length > 0) {
        row = dataRows[0];
        document.getElementById("itemData").removeChild(row);
    };
    
	//read db data and create new table rows
    var query = "SELECT * FROM Users;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
                for (var i = 0; i < results.rows.length; i++) {
                
                    var row = results.rows.item(i);
                    var li = document.createElement("li");
					li.setAttribute("id", row['ID']);
                    li.setAttribute("class", "data");
                    li.setAttribute("onclick", "onSelect(this)");
                    
                    var liText = document.createTextNode(row['AppUserID'] + " x "+ row['AppUserName']);
                    li.appendChild(liText);
                    
                    document.getElementById("itemData").appendChild(li);
                }
            }, function(transaction, error){
                updateStatus("Error: " + error.code + "<br>Message: " + error.message);
            });
        });
    } 
    catch (e) {
        updateStatus("Error: Unable to select data from the db " + e + ".");
    }
}

// 3. misc utility functions

// db data handler

errorHandler = function(transaction, error){
    updateStatus("Error: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results){
}

// update view functions

function updateForm(id, amount, name){
    document.itemForm.id.value = id;
    document.itemForm.amount.value = amount;
    document.itemForm.name.value = name;
}

function updateStatus(status){
    document.getElementById('status').innerHTML = status;
}
