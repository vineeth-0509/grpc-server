import path from "path";
import * as grpc from "@grpc/grpc-js";
import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";
// this proto-loader library is used to parse the a.proto file.
import * as protoLoader from "@grpc/proto-loader";
import { Server } from "http";

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../src/a.proto")
  // Users/Manasa/coding/grpc/a.proto
);
const personProto = grpc.loadPackageDefinition(packageDefinition);
//personProto object where it has the details of the protoFile. it understands like in a.proto it has like AddressBookService and GetPersonByNameService.

const PERSONS: any[] = [];
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
server.addService(
  (personProto.AddressBookService as ServiceClientConstructor).service,
  { addPerson: addPerson, getPersonByName: getPersonByName }
); // it basically means register to this .service with these addPerson:addPerson function.
//here the second argument is the handler for the AddPerson function whoever call the AddPerson it reaches to this handler in this file addPerson.
server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if(err){
        console.error("Server failed to bind:", err);
        return;
    }
    console.log(`grpc server is runnign on port ${port}`)
  }
);
