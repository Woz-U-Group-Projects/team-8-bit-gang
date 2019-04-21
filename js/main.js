import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import {createLevelLoader} from './loaders/level.js';
import {loadFont} from './loaders/font.js';
import {loadEntities} from './entities.js';
import {setupKeyboard} from './input.js';
import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import KeyboardState from './KeyboardState.js';


function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(16, 12);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

async function main(canvas) {
    const context = canvas.getContext('2d');

    const [entityFactory, font] = await Promise.all([
        loadEntities(),
        loadFont(),
    ]);

    const loadLevel = await createLevelLoader(entityFactory);

    const level = await loadLevel('1-1');

    const camera = new Camera();

    const mario = entityFactory.mario();

    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);


    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(createDashboardLayer(font, playerEnv));

    const input = setupKeyboard(mario);
    input.listenTo(window);

    //Touch screen inputs//

    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('touchcancel', touchCancel);
    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('touchend', touchEnd);

    function touchX(x) {
        if(x > mario.go.dir) {
            mario.go.dir += x && mario.go.dir < 3 ? 1: 0;
        }else{
            mario.go.dir += x && mario.go.dir > -3 ? -1 : 0;
        }
    }

    function touchY(y) {
        if(y > mario.jump.ready) {
            mario.jump.start();
        } else {
            mario.jump.cancel();
        }
    }
    function touchStart(e) {
        touchY(e.touches[0].clientY);
    }
    function touchCancel(e) {
        e.preventDefault();
        mario.go.dir = 0;
        mario.jump.cancel();
    }
    function touchMove(e) {
        e.preventDefault();
        touchX(e.touches[0].clientX);
    }
    function touchEnd(e) {
        e.preventDefault();
        mario.go.dir = 0;
        mario.jump.cancel();
    }

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        level.update(deltaTime);
        camera.pos.x = Math.max(0, mario.pos.x - 100);

        level.comp.draw(context, camera);
    }

    timer.start();
}

const canvas = document.getElementById('screen');
main(canvas);
