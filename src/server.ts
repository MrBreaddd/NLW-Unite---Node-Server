import fastify from "fastify";
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod";
import { z } from 'zod';
import {PrismaClient} from '@prisma/client';
import {generateSlug} from "./utils/generateSlug";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const prisma = new PrismaClient({
    log: ['query'],
})

app.get('/', () => {
    return 'Bhaskara'
})

app
.withTypeProvider<ZodTypeProvider>() //utiliza a função do fastify que integra o zod
.post('/events', {
    //objeto que contem os formatos utilizando zod
    schema:{
        body: z.object({
            title: z.string().min(4),
            details: z.string().nullable(),
            maxAttendees: z.number().int().positive().nullable(),
        }),

        response: {
            //especifica o formato da resposta 201
            201: z.object({
                eventId: z.string().uuid(),
            })
        }
    },
}, async (request, reply) => {

    
    const {
        title,
        details,
        maxAttendees,
    } = request.body

    const slug = generateSlug(title)

    const eventWithSameSlug = await prisma.event.findUnique({
        where:{
            slug: slug, //comparativo onde slug: é o event e slug, é a variável pode ser escrita de outra forma
        }
    })

    if(eventWithSameSlug != null){
        throw new Error('Another event with same title already exists')
    }

    const event = await prisma.event.create({
        data: {
            title, //forma alternativa de comparativo onde o nome de ambos os lados é igual
            details,
            maxAttendees,
            slug,
        },
    })

    return reply.status(201).send({ eventId: event.id})
})



app.listen({ port: 3333}).then(() => {
    console.log('HTTP server running!')
})