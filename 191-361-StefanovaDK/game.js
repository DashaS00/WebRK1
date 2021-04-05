class Bottom
{
	constructor(image, y)
	{
		this.x = 0;
		this.y = y;
		this.loaded = false;

		this.image = new Image();
		
		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update(bottom) 
	{
		this.y += speed; 

		if(this.y > window.innerHeight) 
		{
			this.y = bottom.y - canvas.width + speed; 
		}
	}
}

class Fish
{
	constructor(image, x, y, isPlayer)
	{
		this.x = x;
		this.y = y;
		this.loaded = false;
		this.dead = false;
		this.isPlayer = isPlayer;

		this.image = new Image();

		var obj = this;

		this.image.addEventListener("load", function () { obj.loaded = true; });

		this.image.src = image;
	}

	Update()
	{
		if(!this.isPlayer)
		{
			this.y += speed;
		}

		if(this.y > canvas.height + 50)
		{
			this.dead = true;
		}
	}

	Collide(fish)
	{
		var hit = false;

		if(this.y < fish.y + fish.image.height * scale && this.y + this.image.height * scale > fish.y) 
		{
			if(this.x + this.image.width * scale > fish.x && this.x < fish.x + fish.image.width * scale) 
			{
				hit = true;
			}
		}

		return hit;
	}

	Move(v, d) 
	{
		if(v == "x") 
		{
			d *= 2;

			this.x += d; 
			
			if(this.x + this.image.width * scale > canvas.width)
			{
				this.x -= d; 
			}
	
			if(this.x < 0)
			{
				this.x = 0;
			}
		}
		else 
		{
			this.y += d;

			if(this.y + this.image.height * scale > canvas.height)
			{
				this.y -= d;
			}

			if(this.y < 0)
			{
				this.y = 0;
			}
		}
		
	}
}


const UPDATE_TIME = 1000 / 60;

var timer = null;

var canvas = document.getElementById("canvas"); 
var ctx = canvas.getContext("2d"); 

var scale = 0.1; 

Resize(); 

window.addEventListener("resize", Resize); 

canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }); 

window.addEventListener("keydown", function (e) { KeyDown(e); }); 

var objects = []; 

var bottoms = 
[
	new Bottom("images/bottom.jpg", 0),
	new Bottom("images/bottom.jpg", canvas.width)
]; //Backgrounds

var player = new Fish("images/yellow_fish.png", canvas.width / 2, canvas.height / 2, true); 


var speed = 5;

Start();


function Start()
{
	if(!player.dead)
	{
		timer = setInterval(Update, UPDATE_TIME); 
	}
	
}

function Stop()
{
	clearInterval(timer); 
	timer = null;
}

function Update() 
{
	bottoms[0].Update(bottoms[1]);
	bottoms[1].Update(bottoms[0]);

	if(RandomInteger(0, 10000) > 9700) 
	{
		objects.push(new Fish("images/piranha.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false));
	}

	player.Update();

	if(player.dead)
	{
		alert("Crash!");
		Stop();
	}

	var isDead = false; 

	for(var i = 0; i < objects.length; i++)
	{
		objects[i].Update();

		if(objects[i].dead)
		{
			isDead = true;
		}
	}

	if(isDead)
	{
		objects.shift();
	}

	var hit = false;

	for(var i = 0; i < objects.length; i++)
	{
		hit = player.Collide(objects[i]);

		if(hit)
		{
			alert("Crash!");
			Stop();
			player.dead = true;
			break;
		}
	}

	Draw();
}

function Draw() //Working with graphics
{
	ctx.clearRect(0, 0, canvas.width, canvas.height); 

	for(var i = 0; i < bottoms.length; i++)
	{
		ctx.drawImage
		(
			bottoms[i].image, 
			0, //First X on image
			0, //First Y on image
			bottoms[i].image.width, 
			bottoms[i].image.height, 
			bottoms[i].x, 
			bottoms[i].y, 
			canvas.width, 
			canvas.width 
		);
	}

	DrawFish(player);

	for(var i = 0; i < objects.length; i++)
	{
		DrawFish(objects[i]);
	}
}

function DrawFish(fish)
{
	ctx.drawImage
	(
		fish.image, 
		0, 
		0, 
		fish.image.width, 
		fish.image.height, 
		fish.x, 
		fish.y, 
		fish.image.width * scale, 
		fish.image.height * scale 
	);
}

function KeyDown(e)
{
	switch(e.keyCode)
	{
		case 37: //Влево
			player.Move("x", -speed);
			break;

		case 39: //Вправо
			player.Move("x", speed);
			break;

		case 38: //Вверх
			player.Move("y", -speed);
			break;

		case 40: //Вниз
			player.Move("y", speed);
			break;

		case 27: //Esc
			if(timer == null)
			{
				Start();
			}
			else
			{
				Stop();
			}
			break;
	}
}

function Resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function RandomInteger(min, max) 
{
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}