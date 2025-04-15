-- Active: 1743667113737@@127.0.0.1@3306@parts
CREATE DATABASE parts
    DEFAULT CHARACTER SET = 'utf8' collate utf8_hungarian_ci;

    use parts;

create table user (uid integer not null auto_increment Primary key,
name varchar(30),
email varchar(50) UNIQUE not null,
password BLOB not null,
address VARCHAR(80) NOT NULL);

create table products (id integer not null AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) UNIQUE NOT NULL,
description varchar(100) not null,
price DECIMAL not null,
stock integer not null,
pictureurl varchar(200));



drop trigger Insert_User;
CREATE Trigger Insert_User BEFORE INSERT on user
for EACH ROW
set new.password = sha2(new.password,256);

drop function login;

create function login(email varchar(50),pwd varchar(20)) RETURNS integer DETERMINISTIC
BEGIN
declare ok integer;
set ok=0;
select uid into ok from user where user.email = email and user.password = sha2(pwd,256);
RETURN ok;
END

insert into user values (null,"Mekk Elek","mekk.elek@bolyai.hu","Titok123","1112 Budapest Varjú u. 12");

insert into user values (null,"Gipsz Jakab","gipsz.jakab@bolyai.hu","Titok123","1024 Budapest Gipsz u. 23");

select login("mekk.elek@bolyai.hu","Titok123");
insert into products VALUES (null,"Féktárcsa","Brembo féktárcsa bevonatolt,belső hűtésű",32270,154,"https://cdn.bardiauto.hu/img/product/thumb/8/7/8/0/2/8780200_original.jpg");
insert into products VALUES (null,"Gumihpriceang","Febest féltengely gumihpriceang belül,93mm,nbr (nitril-butadién-kaucsuk)",5770,599,"https://cromax.hu/tecdoc_images/898f1a672c8568483e808c7b9e96425b.jpg");
insert into products VALUES (null,"Motorolaj","Castrol Magnatec 5W-40 C3 motorolaj 4 liter",14530,702,"https://cromax.hu/img/univ0002/15C9CA_Castrol.JPG");
insert into products VALUES (null,"Akkumulátor","Vpriceta Blue 12v 60ah autó akkumulátor bal+ ázsia",39290,86,"https://cromax.hu/img/akku01/5604110543132_Vpriceta.JPG");
insert into products VALUES (null,"Izzó","Osram Cool Blue Intense (Next Gen) H7 izzó 12V 55W talp:PX26d",3690,3652,"https://cdn.bardiauto.hu/img/product/thumb/1/3/7/4/9/2/13749219_original.jpg");
insert into products VALUES (null,"Akkumulátor töltő","CTEK - MXS 10 akkumulátor töltő 12V/10A",79780,25,"https://cromax.hu/img/akku01/5604110543132_Vpriceta.JPG");
insert into products VALUES (null,"Gyújtógyertya","Denso gyújtógyertya",7340,680,"https://cromax.hu/tecdoc_images/e11b6016d2c8684749c01e52a3bf1f6d.jpg");