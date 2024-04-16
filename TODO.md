
# h1-> MAPA	✅
- necesito un maptile que genere un laberinto aleatorio ✅
- necesito un player que se pueda desplazar por el laberinto teniendo en cuenta los choques.✅
- necesito marcado un camino hacia la salida ✅
- necesito que pueda cambiar de  pisos al llegar al final y regresar al anterior al ponerse al principio✅
- necesito un player que se pueda desplazar en el piso y tenga eventos en cada toque, los eventos por ahora solo deben mandar un mensaje en pantalla.✅

# h2-> BATALLA	✅
- necesito que se pueda ubicar un enemigo en pantalla ✅
- necesito que el player al tocar un enemigo en el mapa abra una escena de batallas ✅
- necesito una escena de batalla entre el player y entidades enemigas que funcione automaticamente (sin  intervencion del player) = auto-battler ✅
- la batalla debe ser coordinada por turnos.✅
- la batalla se pueda pausar , aumentar velocidad o normalizar velocidad. ❎❌
- el player debe poder escapar de la batalla y regresar al mapa✅

# h3 -> VIDA	✅
- los mobs y el player tendran una propiedad vida que sera visible en un lifebar ✅
- la batalla debe terminar si todos los mobs tiene la vida = 0 y el player regresara al mapa.✅
- al morir el jugador debe saltar una escena de muerte y se debe volver a comenzar el juego. ✅


# h4 -> ATRIBUTOS de Batalla	✅
- cada entidad debe tener los atributos y habilidades que modifiquen el comportamiento de la batalla
-atributos:  ✅
	 hp, ataque, defense, velocidad, evation.
-habilidades:  ✅
	vampirismo: roba un porcentaje de vida siempre del daño.	✔
	envenenar: dar estado envenenar				 				✔
	sangrar:  da estado sangrado								✔
	quemar:  dar estado quemar.									✔
    stunear: probablidad de dar estado paralisis				✔
	proyectil: lanza un proyectil hacia un enemigo aleatorio.	✔
	ataque adicional: probabilidad de repetir el ataque			✔
    contratacar: probabilidad de regresar un golpe  			✔  			
	bloqueo: probabilidad de bloquear un ataque.				✔
	regeneration: recupera un porcentaje de vida.				✔
-estados los estados se ejecutaran por turno y desapareceran n turnos:✅
	- envenenado: pierde 1vida									✔
	- sangrado: pierde 1 vida									✔
	- quemado:  pierde 1 vida									✔
	- paralizado: pierde 1 turno								✔

# h5 -> ARMAS y ARMADURAS ✅
- el jugador tendra un inventario y equipo
- el jugador podra equipar armas y armaduras las cuales alteraran sus atributos de batalla
-> weapons:
	- espada: +ataque +defensa +skill-bleed | +skill-vampirism | +skill-counter
	- martillo: +ataque +maxhp +skill-stun
	- arco:+ataque +speed +skill-bleed | +skill-poison
	- staff: +evation +skill-burn | +skill-proyectil | +skill-regeneration
	- spear: +evation +skill-bleed | +skill-vampirism | +skill-attack-plus
-> armors:
	- chest: +defense +hp 
	- shield: ++defense
	- helmet: +defense +evation
 	- ring:  maxhp, velocidad, evation.
	- necklace: maxhp, velocidad, evation.

# h6 -> interfaz
-se requiere una interfaz que logre ver los atributos la vida y las habilidades.
- la interfaz debe mostrar el piso donde se encuentra

# h7 -> batalla con habilidades y attributos ✅
- El calculo de daño debe depender ahora de los atributos de las entidades player y mobs
- la batalla sera de velocidad x fases en donde cada actor con el atributo velocidad se le calculara la rapidez de actuar
 -> fases:
	-idle: nadie ataca hasta que algun mob reclame el turno por rapidez
	para no esperar tanto calcularemos un action progress 
	donde cada entity tiene un AP que va de 0  a 60
	el AP guarda el valor entre fase	
	EJM:
	speed=10
	currentAP=0
	MAXAP=60	
	prioritySpeed=(MAXAP-currentAP)/speed	

	elige el entity con menor prioritySpeed
	
	suponiendo que el menor es 12			
	almacenamos el currentAP de cada entity
	currentAP=max(MAXAP,currentAP+ 12)	
	
	el currentAp del que acaba de elegir turno = 0
	-action: el que reclamo el turno actua
	-end: el que reclamo el turno suelta el turno y la fase termina en idle.


	
### ------------------- DONE ---------------------