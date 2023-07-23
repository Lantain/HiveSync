import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseModule } from 'nestjs-firebase';
import { HivesModule } from './hives/hives.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SensorsModule } from './sensors/sensors.module';
import { JwtModule } from '@nestjs/jwt';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    HivesModule,
    AuthModule,
    SensorsModule,
    UsersModule,
    RecordsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory(cfg: ConfigService) {
          return {
              secret: cfg.get("SECRET"),
              global: true,
              signOptions: { expiresIn: '7d' }
          }
      },
      inject: [ConfigService]
   }),
    FirebaseModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(cfg: ConfigService) {
        const firebaseType = cfg.get("FIREBASE_TYPE")
        const projectId = cfg.get("FIREBASE_PROJECT_ID")
        const privateKeyId = cfg.get("FIREBASE_PRIVATE_KEY_ID")
        const privateKey = cfg.get("FIREBASE_PRIVATE_KEY").replace(/\\n/gm, "\n")
        const clientEmail = cfg.get("FIREBASE_CLIENT_EMAIL")
        const clientId = cfg.get("FIREBASE_CLIENT_ID")
        const authUri = cfg.get("FIREBASE_AUTH_URI")
        const tokenUri = cfg.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL")
        const authProviderX509CertUrl = cfg.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL")
        const clientX509CertUrl = cfg.get("FIREBASE_CLIENT_X509_CERT_URL")
        const universeDomain = cfg.get("FIREBASE_UNIVERSE_DOMAIN")
        const storageBucket = cfg.get("FIREBASE_STORAGE_BUCKET")

        return {
          projectId,
          storageBucket,
          // databaseURL: "",
          googleApplicationCredential: {
            projectId,
            clientEmail,
            privateKey: privateKey
          }
        }
      },
    })
  ],
})
export class AppModule { }
