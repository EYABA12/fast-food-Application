# Étape 1 : Build avec Maven (Image stable)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# Cache des dépendances
COPY pom.xml .
RUN mvn dependency:go-offline

# Build de l'application
COPY src ./src
RUN mvn clean package -DskipTests 

# Étape 2 : Image finale (C'est ici que tu avais l'erreur !)
# On remplace openjdk:17-jdk-slim qui n'existe plus par eclipse-temurin
FROM eclipse-temurin:17-jdk-jammy

# Copie du jar depuis l'étape build
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8089
ENTRYPOINT [ "java", "-jar", "app.jar" ]