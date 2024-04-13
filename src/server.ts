import fastify from "fastify";
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod";
import { CreateEvent } from "./routes/create-event";


const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(CreateEvent)

app.get('/', () => {
    return 'Bhaskara'
})

app.listen({ port: 3333}).then(() => {
    console.log('HTTP server running!')
})