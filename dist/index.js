"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
// this proto-loader library is used to parse the a.proto file.
const protoLoader = __importStar(require("@grpc/proto-loader"));
const packageDefinition = protoLoader.loadSync(path_1.default.join(__dirname, "../src/a.proto")
// Users/Manasa/coding/grpc/a.proto
);
const personProto = grpc.loadPackageDefinition(packageDefinition);
//personProto object where it has the details of the protoFile. it understands like in a.proto it has like AddressBookService and GetPersonByNameService.
const PERSONS = [];
//call => similar to the req object in the experss.
//callback => similar to the response.
//the arguments that we get in the grpc-js include 2 things call-all the details of the function call and
// the 2.Callback: which something we call with the response
//@ts-ignore
function addPerson(call, callback) {
    console.log(call);
    let person = {
        name: call.request.name,
        age: call.request.age,
    };
    //in grpc we dont need to write any compression logic or decompression logic,it is automatically done by the grpc library.
    //this is why grpc is famous we get the benefits of protobufs under the hood when we call the call anything, the data reaches to the other side is by using protobufs only.
    PERSONS.push(person);
    callback(null, person);
}
//@ts-ignore
function getPersonByName(call, callback) {
    console.log(call);
    const name = call.request.name;
    const person = PERSONS.find((x) => x.name === name);
    callback(null, person);
}
const server = new grpc.Server();
//similar to like app.use('/',routeHandler);
//all the handlers for this service.
server.addService(personProto.AddressBookService.service, { addPerson: addPerson, getPersonByName: getPersonByName }); // it basically means register to this .service with these addPerson:addPerson function.
//here the second argument is the handler for the AddPerson function whoever call the AddPerson it reaches to this handler in this file addPerson.
server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error("Server failed to bind:", err);
        return;
    }
    console.log(`grpc server is runnign on port ${port}`);
});
