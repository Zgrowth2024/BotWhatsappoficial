const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf8")


const flowCurso = addKeyword(EVENTS.ACTION)
    .addAnswer( "Bro, aca te envio todo lo que contiene el curso🙌🏻", {
    media: "https://www.ujamaaresort.org/wp-content/uploads/2018/01/Ujamaa-restaurant-menu.pdf",
  }
);

const flowComprobante = addKeyword(EVENTS.ACTION)
    .addAnswer("Rey, me compartis el comprobante en formato Imagen o Screenshot🙏🏻");
   

const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer("Amigo, dejame tu consulta y te respondo en breve👇🏻");


const flowImagen = addKeyword(EVENTS.MEDIA)
    .addAnswer("Hermano, perfecto dame la siguiente informacion para darte el acceso.")
    .addAnswer( [ "Nombre completo:",
             "E-mail:",
             "Numero de contacto:",
            ])


const flowPagos = addKeyword("Acceso")
    .addAnswer("Bro, seria un placer que seas parte🫂")
    .addAnswer([ "Que te queda mas comodo?",

             "*- Mercado Pago*",
             "*- Transferencia*",
             "*- Tarjeta de credito*",
            ])

const flowWelcome = addKeyword(EVENTS.WELCOME)
    .addAnswer("Rey, como estas? Aca te saluda LucaBarber💈", {
       delay: 3000,
    },
        async (ctx, ctxFn) => {
            if (ctx.body.includes("bro", "hermano", "rey", "Luca")) {
                await ctxFn.flowDynamic("Escribi la palabra *Menú* para ver las opciones")
            } else {
                await ctxFn.flowDynamic("Escribi la palabra *Menú* para ver las opciones")
            }
        })

const menuFlow = addKeyword("Menú", "Menu", "menu").addAnswer(
  menu,
  { capture: true },
  async (ctx, { gotoFlow, fallback, flowDynamic }) => {
    if (!["1", "2", "3", "0"].includes(ctx.body)) {
      return fallback(
        "Respuesta no valida, por favor selecciona una de las opciones."
      );
    }
    switch (ctx.body) {
      case "1":
        return gotoFlow(flowCurso);
      case "2":
        return gotoFlow(flowComprobante);
      case "3":
        return gotoFlow(flowConsultas);
      case "0":
        return await flowDynamic(
          "Puedes volver al menu, escribiendo la palabra *menu*"
        );
    }
  }
);


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([ flowWelcome,menuFlow,flowCurso,flowComprobante,flowConsultas, flowImagen, flowPagos]);
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
