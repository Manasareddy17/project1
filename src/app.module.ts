import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pdfModule } from './pdf/pdf.module';

@Module({
    imports: [TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Manasa@178',
      database: 'task1',
      entities: [],
      synchronize: false,
      logging: true,

    }),pdfModule],
 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
