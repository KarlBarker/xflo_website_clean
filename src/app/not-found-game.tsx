"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoIcon } from '@/components/ui/logo-icon';
import { ArrowLeft } from 'lucide-react';

export function NotFoundGame() {
  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-var, prefer-const */
    // Simple JavaScript Inheritance (modified for strict mode)
    (function(){
      let initializing = false, fnTest = /xyz/.test('xyz') ? /\b_super\b/ : /.*/;
     
      // @ts-expect-error - Adding Class to window for game compatibility
      window.Class = function(){};
     
      const extend = function(this: any, prop: any) {
        const _super = this.prototype;
       
        initializing = true;
        const prototype = new this();
        initializing = false;
       
        for (const name in prop) {
          prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
              return function(this: any, ...args: any[]) {
                const tmp = this._super;
                this._super = _super[name];
                const ret = fn(...args);        
                this._super = tmp;
                return ret;
              };
            })(name, prop[name]) :
            prop[name];
        }
       
        function Class(this: any, ...args: any[]) {
          if ( !initializing && this.init )
            this.init(...args);
        }
       
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = extend;
       
        return Class;
      };
      
      // @ts-expect-error - Adding extend to Class constructor
      window.Class.extend = extend;
    })();

    // Game Constants
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 580;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const SHOOT_KEY = 32; // Space bar

    // Sprite data (base64 encoded sprite sheet)
    const SPRITE_SHEET_SRC = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAEACAYAAAADRnAGAAACGUlEQVR42u3aSQ7CMBAEQIsn8P+/hiviAAK8zFIt5QbELiTHmfEYE3L9mZE9AAAAqAVwBQ8AAAD6THY5CgAAAKbfbPX3AQAAYBEEAADAuZrC6UUyfMEEAIBiAN8OePXnAQAAsLcmmKFPAQAAgHMbm+gbr3Sdo/LtcAAAANR6GywPAgBAM4D2JXAAABoBzBjA7AmlOx8AAEAzAOcDAADovTc4vQim6wUCABAYQG8QAADd4dPd2fRVYQAAANQG0B4HAABAawDnAwAA6AXgfAAAALpA2uMAAABwPgAAgPoAM9Ci/R4AAAD2dmqcEQIAIC/AiQGuAAYAAECcRS/a/cJXkUf2AAAAoBaA3iAAALrD+gIAAADY9baX/nwAAADNADwFAADo9YK0e5FMX/UFACA5QPSNEAAAAHKtCekmDAAAAADvBljtfgAAAGgMMGOrunvCy2uCAAAACFU6BwAAwF6AGQPa/XsAAADYB+B8AAAAtU+ItD4OAwAAAFVhAACaA0T7B44/BQAAANALwGMQAAAAADYO8If2+P31AgAAQN0SWbhFDwCAZlXgaO1xAAAA1FngnA8AACAeQPSNEAAAAM4CnC64AAAA4GzN4N9NSfgKEAAAAACszO26X8/X6BYAAAD0Anid8KcLAAAAAAAAAJBnwNEvAAAA9Jns1ygAAAAAAAAAAAAAAAAAAABAQ4COCENERERERERERBrnAa1sJuUVr3rsAAAAAElFTkSuQmCC';

    // Sprite clip rectangles
    const PLAYER_CLIP_RECT = { x: 0, y: 204, w: 62, h: 32 };
    const ALIEN_BOTTOM_ROW = [ { x: 0, y: 0, w: 51, h: 34 }, { x: 0, y: 102, w: 51, h: 34 }];
    const ALIEN_MIDDLE_ROW = [ { x: 0, y: 137, w: 50, h: 33 }, { x: 0, y: 170, w: 50, h: 34 }];
    const ALIEN_TOP_ROW = [ { x: 0, y: 68, w: 50, h: 32 }, { x: 0, y: 34, w: 50, h: 32 }];
    const ALIEN_X_MARGIN = 40;

    // Global variables
    let canvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    let spriteSheetImg: HTMLImageElement | null = null;
    let bulletImg: HTMLImageElement | null = null;
    const keyStates: boolean[] = [];
    let prevKeyStates: boolean[] = [];
    let lastTime = 0;
    let player: any = null;
    let aliens: any[] = [];
    let particleManager: any = null;
    let updateAlienLogic = false;
    let alienDirection = -1;
    let alienYDown = 0;
    let alienCount = 0;
    let wave = 1;
    let showIntro = true;
    let introOpacity = 1;
    let introStartTime = 0;
    let introLogoImg: HTMLImageElement | null = null;

    // Utility functions
    function getRandomArbitrary(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function clamp(num: number, min: number, max: number) {
      return Math.min(Math.max(num, min), max);
    }

    function valueInRange(value: number, min: number, max: number) {
      return (value <= max) && (value >= min);
    }
     
    function checkRectCollision(A: any, B: any) {
      const xOverlap = valueInRange(A.x, B.x, B.x + B.w) ||
      valueInRange(B.x, A.x, A.x + A.w);
     
      const yOverlap = valueInRange(A.y, B.y, B.y + B.h) ||
      valueInRange(B.y, A.y, A.y + A.h); 
      return xOverlap && yOverlap;
    }

    // @ts-expect-error - Game class inheritance pattern
    const Point2D = window.Class.extend({
      init: function(x: number, y: number) {
        this.x = (typeof x === 'undefined') ? 0 : x;
        this.y = (typeof y === 'undefined') ? 0 : y;
      },
      
      set: function(x: number, y: number) {
        this.x = x;
        this.y = y;
      }
    });

    // @ts-expect-error - Game class inheritance pattern
    const Rect = window.Class.extend({
      init: function(x: number, y: number, w: number, h: number) {
        this.x = (typeof x === 'undefined') ? 0 : x;
        this.y = (typeof y === 'undefined') ? 0 : y;
        this.w = (typeof w === 'undefined') ? 0 : w;
        this.h = (typeof h === 'undefined') ? 0 : h;
      },
      
      set: function(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
      }
    });

    // @ts-expect-error - Game class inheritance pattern
    const BaseSprite = window.Class.extend({
      init: function(img: HTMLImageElement, x: number, y: number) {
        this.img = img;
        this.position = new Point2D(x, y);
        this.scale = new Point2D(1, 1);
        this.bounds = new Rect(x, y, this.img.width, this.img.height);
        this.doLogic = true;
      },
                               
      update: function(dt: number) { },
      
      _updateBounds: function() {
         this.bounds.set(this.position.x, this.position.y, ~~(0.5 + this.img.width * this.scale.x), ~~(0.5 + this.img.height * this.scale.y));
      },
      
      _drawImage: function() {
        ctx!.drawImage(this.img, this.position.x, this.position.y);
      },
      
      draw: function(resized: boolean) {
        this._updateBounds();
        this._drawImage();
      }
    });

    const SheetSprite = BaseSprite.extend({
      init: function(sheetImg: HTMLImageElement, clipRect: any, x: number, y: number) {
        BaseSprite.prototype.init.call(this, sheetImg, x, y);
        this.clipRect = clipRect;
        this.bounds.set(x, y, this.clipRect.w, this.clipRect.h);
      },
      
      update: function(dt: number) {},
      
      _updateBounds: function() {
        var w = ~~(0.5 + this.clipRect.w * this.scale.x);
        var h = ~~(0.5 + this.clipRect.h * this.scale.y);
        this.bounds.set(this.position.x - w/2, this.position.y - h/2, w, h);
      },
      
      _drawImage: function() {
        ctx!.save();
        ctx!.transform(this.scale.x, 0, 0, this.scale.y, this.position.x, this.position.y);
        ctx!.drawImage(this.img, this.clipRect.x, this.clipRect.y, this.clipRect.w, this.clipRect.h, ~~(0.5 + -this.clipRect.w*0.5), ~~(0.5 + -this.clipRect.h*0.5), this.clipRect.w, this.clipRect.h);
        ctx!.restore();
      },
      
      draw: function(resized: boolean) {
        BaseSprite.prototype.draw.call(this, resized);
      }
    });

    const Player = SheetSprite.extend({
      init: function() {
        SheetSprite.prototype.init.call(this, spriteSheetImg, PLAYER_CLIP_RECT, CANVAS_WIDTH/2, CANVAS_HEIGHT - 120);
        this.scale.set(0.85, 0.85);
        this.lives = 3;
        this.xVel = 0;
        this.bullets = [];
        this.bulletDelayAccumulator = 0;
        this.score = 0;
      },
      
      reset: function() {
        this.lives = 3;
        this.score = 0;
        this.position.set(CANVAS_WIDTH/2, CANVAS_HEIGHT - 120);
      },
      
      shoot: function() {
        var bullet = new Bullet(this.position.x, this.position.y - this.bounds.h / 2, 1, 1000);
        this.bullets.push(bullet);
      },
      
      handleInput: function() {
        if (isKeyDown(LEFT_KEY)) {
          this.xVel = -175;
        } else if (isKeyDown(RIGHT_KEY)) {
          this.xVel = 175;
        } else this.xVel = 0;
        
        if (wasKeyPressed(SHOOT_KEY)) {
          if (this.bulletDelayAccumulator > 0.3) {
            this.shoot(); 
            this.bulletDelayAccumulator = 0;
          }
        }
      },
      
      updateBullets: function(dt: number) {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
          var bullet = this.bullets[i];
          if (bullet.alive) {
            bullet.update(dt);
          } else {
            this.bullets.splice(i, 1);
            bullet = null;
          }
        }
      },
      
      update: function(dt: number) {
        this.bulletDelayAccumulator += dt;
        this.position.x += this.xVel * dt;
        this.position.x = clamp(this.position.x, this.bounds.w/2, CANVAS_WIDTH - this.bounds.w/2);
        this.updateBullets(dt);
      },
      
      draw: function(resized: boolean) {
        SheetSprite.prototype.draw.call(this, resized);
        for (var i = 0, len = this.bullets.length; i < len; i++) {
          var bullet = this.bullets[i];
          if (bullet.alive) {
            bullet.draw(resized);
          }
        }
      }
    });

    const Bullet = BaseSprite.extend({
      init: function(x: number, y: number, direction: number, speed: number) {
        BaseSprite.prototype.init.call(this, bulletImg, x, y);
        this.direction = direction;
        this.speed = speed;
        this.alive = true;
      },
      
      update: function(dt: number) {
        this.position.y -= (this.speed * this.direction) * dt;
        
        if (this.position.y < 0 || this.position.y > CANVAS_HEIGHT) {
          this.alive = false;
        }
      },
      
      draw: function(resized: boolean) {
        BaseSprite.prototype.draw.call(this, resized);
      }
    });

    const Enemy = SheetSprite.extend({
      init: function(clipRects: any[], x: number, y: number) {
        SheetSprite.prototype.init.call(this, spriteSheetImg, clipRects[0], x, y);
        this.clipRects = clipRects;
        this.scale.set(0.5, 0.5);
        this.alive = true;
        this.onFirstState = true;
        this.stepDelay = 1;
        this.stepAccumulator = 0;
        this.doShoot = false;
        this.bullet = null;
      },
      
      toggleFrame: function() {
        this.onFirstState = !this.onFirstState;
        this.clipRect = (this.onFirstState) ? this.clipRects[0] : this.clipRects[1];
      },
      
      shoot: function() {
        this.bullet = new Bullet(this.position.x, this.position.y + this.bounds.w/2, -1, 500);
      },
      
      update: function(dt: number) {
        this.stepAccumulator += dt;
        
        if (this.stepAccumulator >= this.stepDelay) {
          if (this.position.x < this.bounds.w/2 + 20 && alienDirection < 0) {
            updateAlienLogic = true;
          } 
          if (alienDirection === 1 && this.position.x > CANVAS_WIDTH - this.bounds.w/2 - 20) {
            updateAlienLogic = true;
          }
          if (this.position.y > CANVAS_HEIGHT - 180) {
            reset();
          }
          
          if (getRandomArbitrary(0, 1000) <= 3) {
            this.doShoot = true;
          }
          this.position.x += 10 * alienDirection;
          this.toggleFrame();
          this.stepAccumulator = 0;
        }
        this.position.y += alienYDown;
        
        if (this.bullet !== null && this.bullet.alive) {
          this.bullet.update(dt);  
        } else {
          this.bullet = null;
        }
      },
      
      draw: function(resized: boolean) {
        SheetSprite.prototype.draw.call(this, resized);
        if (this.bullet !== null && this.bullet.alive) {
          this.bullet.draw(resized);
        }
      }
    });

    // @ts-expect-error - Game class inheritance pattern
    const ParticleExplosion = window.Class.extend({
      init: function() {
        this.particlePool = [];
        this.particles = [];
      },
      
      draw: function() {
        for (var i = this.particles.length - 1; i >= 0; i--) {
          var particle = this.particles[i];
          particle.moves++;
          particle.x += particle.xunits;
          particle.y += particle.yunits + (particle.gravity * particle.moves);
          particle.life--;
          
          if (particle.life <= 0 ) {
            if (this.particlePool.length < 100) {
              this.particlePool.push(this.particles.splice(i,1));
            } else {
              this.particles.splice(i,1);
            }
          } else {
            ctx!.globalAlpha = (particle.life)/(particle.maxLife);
            ctx!.fillStyle = particle.color;
            ctx!.fillRect(particle.x, particle.y, particle.width, particle.height);
            ctx!.globalAlpha = 1;
          }
        }
      },
      
      createExplosion: function(x: number, y: number, color: string, number: number, width: number, height: number, spd: number, grav: number, lif: number) {
        for (var i = 0; i < number; i++) {
          var angle = Math.floor(Math.random()*360);
          var speed = Math.floor(Math.random()*spd/2) + spd;    
          var life = Math.floor(Math.random()*lif)+lif/2;
          var radians = angle * Math.PI/ 180;
          var xunits = Math.cos(radians) * speed;
          var yunits = Math.sin(radians) * speed;
              
          if (this.particlePool.length > 0) {
            var tempParticle = this.particlePool.pop();
            tempParticle.x = x;
            tempParticle.y = y;
            tempParticle.xunits = xunits;
            tempParticle.yunits = yunits;
            tempParticle.life = life;
            tempParticle.color = color;
            tempParticle.width = width;
            tempParticle.height = height;
            tempParticle.gravity = grav;
            tempParticle.moves = 0;
            tempParticle.alpha = 1;
            tempParticle.maxLife = life;
            this.particles.push(tempParticle);
          } else {
            this.particles.push({x:x,y:y,xunits:xunits,yunits:yunits,life:life,color:color,width:width,height:height,gravity:grav,moves:0,alpha:1, maxLife:life});
          }    
        }
      }
    });

    function initCanvas() {
      canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      if (!canvas) return;
      
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Turn off image smoothing for pixel-perfect rendering
      ctx.imageSmoothingEnabled = false;
      
      spriteSheetImg = new Image();
      spriteSheetImg.src = SPRITE_SHEET_SRC;  
      
      // Load the intro logo image
      introLogoImg = new Image();
      introLogoImg.onload = () => {
        console.log('Logo image loaded successfully');
      };
      introLogoImg.onerror = () => {
        console.log('Logo image failed to load, falling back to text');
        introLogoImg = null;
      };
      introLogoImg.src = '/images/space_invaders_logo.png';
      
      preDrawImages();

      window.addEventListener('resize', resize);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
    }

    function preDrawImages() {
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 8;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#2ecc71'; // Use brand green color
      ctx.fillRect(0, 0, 2, 8);
      
      bulletImg = new Image();
      bulletImg.src = canvas.toDataURL();
    }

    function initGame() {
      aliens = [];
      player = new Player();
      particleManager = new ParticleExplosion();
      setupAlienFormation();
    }

    function setupAlienFormation() {
      alienCount = 0;
      
      // 8-bit pixel patterns for "404"
      const digit4 = [
        [1, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0, 0]
      ];
      
      const digit0 = [
        [0, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 0]
      ];
      
      const patterns = [digit4, digit0, digit4];
      const digitWidth = 6;
      const digitSpacing = 2;
      const totalWidth = (digitWidth * 3) + (digitSpacing * 2);
      const startX = (CANVAS_WIDTH - totalWidth * 25) / 2; // 25px spacing between aliens
      const startY = 120;
      
      patterns.forEach((pattern, digitIndex) => {
        const digitOffsetX = digitIndex * (digitWidth + digitSpacing) * 25;
        
        pattern.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (cell === 1) {
              const x = startX + digitOffsetX + colIndex * 25;
              const y = startY + rowIndex * 25;
              
              // Choose alien type based on position for variety
              let clipRects;
              if (rowIndex < 2) {
                clipRects = ALIEN_TOP_ROW;
              } else if (rowIndex < 5) {
                clipRects = ALIEN_MIDDLE_ROW;
              } else {
                clipRects = ALIEN_BOTTOM_ROW;
              }
              
              aliens.push(new Enemy(clipRects, x, y));
              alienCount++;
            }
          });
        });
      });
    }

    function reset() {
      aliens = [];
      setupAlienFormation();
      player.reset();
    }

    function isKeyDown(key: number) {
      return keyStates[key];
    }

    function wasKeyPressed(key: number) {
      return !prevKeyStates[key] && keyStates[key];
    }

    function updateAliens(dt: number) {
      if (updateAlienLogic) {
        updateAlienLogic = false;
        alienDirection = -alienDirection;
        alienYDown = 15;
      }
      
      for (let i = aliens.length - 1; i >= 0; i--) {
        const alien = aliens[i];
        if (!alien.alive) {
          aliens.splice(i, 1);
          alienCount--;
          if (alienCount < 1) {
            wave++;
            setupAlienFormation();
          }
          return;
        }
        
        alien.stepDelay = ((alienCount * 20) - (wave * 10)) / 1000;
        if (alien.stepDelay <= 0.05) {
          alien.stepDelay = 0.05;
        }
        alien.update(dt);
        
        if (alien.doShoot) {
          alien.doShoot = false;
          alien.shoot();
        }
      }
      alienYDown = 0;
    }

    function resolveBulletEnemyCollisions() {
      const bullets = player.bullets;
      
      for (let i = 0, len = bullets.length; i < len; i++) {
        const bullet = bullets[i];
        for (let j = 0, alen = aliens.length; j < alen; j++) {
          const alien = aliens[j];
          if (checkRectCollision(bullet.bounds, alien.bounds)) {
            alien.alive = bullet.alive = false;
            particleManager.createExplosion(alien.position.x, alien.position.y, '#dc2626', 70, 5,5,3,.15,50);
            player.score += 25;
          }
        }
      }
    }

    function resolveBulletPlayerCollisions() {
      for (let i = 0, len = aliens.length; i < len; i++) {
        const alien = aliens[i];
        if (alien.bullet !== null && checkRectCollision(alien.bullet.bounds, player.bounds)) {
          if (player.lives === 0) {
            // Game over - player has no lives left
            reset();
          } else {
           alien.bullet.alive = false;
           particleManager.createExplosion(player.position.x, player.position.y, '#2ecc71', 100, 8,8,6,0.001,40);
           player.position.set(CANVAS_WIDTH/2, CANVAS_HEIGHT - 120);
           player.lives--;
            break;
          }
        }
      }
    }

    function resolveCollisions() {
      resolveBulletEnemyCollisions();
      resolveBulletPlayerCollisions();
    }

    function updateGame(dt: number) {
      player.handleInput();
      prevKeyStates = keyStates.slice();
      player.update(dt);
      updateAliens(dt);
      resolveCollisions();
    }

    function fillText(text: string, x: number, y: number, color?: string, fontSize?: number) {
      if (color) ctx!.fillStyle = color;
      if (fontSize) ctx!.font = fontSize + 'px monospace';
      ctx!.fillText(text, x, y);
    }

    function fillCenteredText(text: string, x: number, y: number, color?: string, fontSize?: number) {
      const metrics = ctx!.measureText(text);
      fillText(text, x - metrics.width/2, y, color, fontSize);
    }

    function drawBottomHud() {
      ctx!.fillStyle = '#2ecc71'; // Brand green color
      ctx!.fillRect(0, CANVAS_HEIGHT - 60, CANVAS_WIDTH, 2);
      fillText(player.lives + ' x ', 10, CANVAS_HEIGHT - 32, 'white', 20);
      ctx!.drawImage(spriteSheetImg!, player.clipRect.x, player.clipRect.y, player.clipRect.w, 
                     player.clipRect.h, 55, CANVAS_HEIGHT - 48, player.clipRect.w * 0.5,
                     player.clipRect.h * 0.5);
      fillText('404 ERROR', CANVAS_WIDTH - 115, CANVAS_HEIGHT - 32, 'white', 20);
      fillCenteredText('SCORE: ' + player.score, CANVAS_WIDTH/2, 20, 'white', 20);
    }

    function drawIntroScreen() {
      if (!ctx) return;
      
      // Clear screen with clean dark background (same as game)
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.save();
      ctx.globalAlpha = introOpacity;
      
      // Try to draw the logo image if available
      if (introLogoImg && introLogoImg.complete && introLogoImg.naturalWidth > 0) {
        // Center the logo on screen with appropriate scaling
        const logoScale = 0.8;
        const logoWidth = introLogoImg.width * logoScale;
        const logoHeight = introLogoImg.height * logoScale;
        const logoX = (CANVAS_WIDTH - logoWidth) / 2;
        const logoY = (CANVAS_HEIGHT - logoHeight) / 2;
        
        ctx.drawImage(introLogoImg, logoX, logoY, logoWidth, logoHeight);
      } else {
        // Fallback: show text while image loads or if image fails
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff8c00';
        ctx.font = 'bold 48px monospace';
        ctx.fillText('PAGE', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 30);
        ctx.fillText('INVADERS', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 30);
      }
      
      ctx.restore();
    }

    function drawAliens(resized: boolean) {
      for (let i = 0; i < aliens.length; i++) {
        const alien = aliens[i];
        alien.draw(resized);
      }
    }

    function drawGame(resized: boolean) {
      player.draw(resized);  
      drawAliens(resized);
      particleManager.draw();
      drawBottomHud();
    }


    function animate() {
      const now = performance.now();
      const dt = now - lastTime;
      
      // Initialize intro start time
      if (introStartTime === 0) {
        introStartTime = now;
      }
      
      // Handle intro screen timing (1s fade in, 1s visible, 2s fade out)
      if (showIntro) {
        const elapsed = now - introStartTime;
        if (elapsed <= 1000) {
          // Fade in over first 1 second
          introOpacity = elapsed / 1000;
        } else if (elapsed <= 2000) {
          // Full opacity for 1 second (1s-2s)
          introOpacity = 1;
        } else if (elapsed <= 4000) {
          // Fade out over 2 seconds (2s-4s)
          introOpacity = Math.max(0, 1 - (elapsed - 2000) / 2000);
        } else {
          // Done after 4 seconds total
          introOpacity = 0;
          showIntro = false;
        }
        drawIntroScreen();
      } else {
        // Normal game logic
        updateGame(dt / 1000);

        // Clear with primary dark color
        ctx!.fillStyle = '#171717';
        ctx!.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        drawGame(false);
      }
      
      lastTime = now;
      requestAnimationFrame(animate);
    }

    function resize() {
      if (!canvas) return;
      
      const w = window.innerWidth;
      const h = window.innerHeight - 180; // Reserve space for text/button
      const scaleFactor = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT) * 0.9;
      
      canvas.style.width = CANVAS_WIDTH * scaleFactor + 'px';
      canvas.style.height = CANVAS_HEIGHT * scaleFactor + 'px';
    }

    function onKeyDown(e: KeyboardEvent) {
      e.preventDefault();
      keyStates[e.keyCode] = true;
    }

    function onKeyUp(e: KeyboardEvent) {
      e.preventDefault();
      keyStates[e.keyCode] = false;
    }

    // Initialize and start the game
    initCanvas();
    initGame();
    resize();
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-var, prefer-const */
  }, []);

  return (
    <div className="h-screen bg-surface-primary relative overflow-hidden" style={{
      backgroundImage: `radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 200px 90px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 240px 50px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 280px 120px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 320px 20px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 360px 100px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 400px 60px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 440px 140px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 480px 80px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 520px 30px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 560px 110px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 600px 70px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 640px 90px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 680px 40px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 720px 120px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 760px 60px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 800px 100px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 840px 30px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 880px 80px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 920px 50px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 960px 130px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 1000px 70px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 1040px 40px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 1080px 110px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 1120px 80px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 1160px 20px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 1200px 90px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 60px 160px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 100px 200px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 140px 180px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 180px 220px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 220px 160px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 260px 240px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 300px 200px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 340px 180px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 380px 260px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 420px 220px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 460px 170px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 500px 240px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 540px 190px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 580px 230px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 620px 160px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 660px 210px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 700px 180px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 740px 250px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 780px 200px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 820px 170px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 860px 240px, rgba(255,255,255,0.8), transparent)`
    }}>
      {/* Logo in top left */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="flex items-center" aria-label="Home page">
          <LogoIcon 
            darkMode="True"
            className="h-8 w-auto" 
            aria-hidden="true"
          />
        </Link>
      </div>
      
      {/* Game content */}
      <div className="flex flex-col items-center justify-start pt-20 p-4">
      {/* Game Canvas */}
      <div className="relative mb-4">
        <canvas
          id="game-canvas"
          width={640}
          height={580}
          className="rounded-lg"
          style={{
            imageRendering: 'pixelated' as React.CSSProperties['imageRendering']
          }}
        />
      </div>

      {/* Instructions */}
      <div className="text-center mb-4 max-w-lg">
        <p className="text-base md:text-lg font-medium text-white mb-4">
          Oh no this page cannot be found, must have been the aliens... Get back to safety
        </p>
        
        {/* Navigation */}
        <Button variant="outline" asChild className="text-white hover:text-primary-dark">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Safety
          </Link>
        </Button>
      </div>
      </div>
    </div>
  );
}