import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("Flutter-Nest")
    .setDescription("Flutter-Nest API")
    .setVersion("1.0")
    .build();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useStaticAssets(join(__dirname, "..", "public"));

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: [
      process.env.CLIENT_URL || `http://localhost:3001`,
      `http://localhost:3000`,
    ],
    credentials: true,
  });

  await app.listen(PORT);
}

bootstrap();
