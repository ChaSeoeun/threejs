// three.js 라이브러리를 '/three.js-master/build/three.module.js' 경로에서 가져오기
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

// App 클래스 생성 (3D 애플리케이션의 구조 설정용)
class App {
    constructor() {
        // HTML에서 WebGL이 렌더링될 div 요소를 찾고 저장
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        // WebGLRenderer 객체 생성 (반올림 및 부드러운 렌더링을 위해 antialias 옵션 활성화 ** 3차원 객체가 랜더링될 때 오브젝트들의 경계선이 계단현상없이 부드럽게 표현됨)
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio); // 디스플레이의 픽셀 비율에 맞추어 렌더링 품질을 조정
        divContainer.appendChild(renderer.domElement); // 렌더링된 캔버스를 divContainer에 추가
        this._renderer = renderer;

        // 씬(Scene) 생성: 3D 객체가 배치될 가상 공간
        const scene = new THREE.Scene();
        this._scene = scene;

        // 카메라, 조명, 모델 설정 함수 호출
        this._setupCamera();
        this._setupLight();
        this._setupModel();

        // 창 크기 변경 시, 3D 화면도 자동으로 크기에 맞춰 조정되도록 resize 함수 바인딩
        window.onresize = this.resize.bind(this);
        this.resize(); // 초기 크기 설정

        // render 함수 호출하여 매 프레임마다 화면을 새로 렌더링
        requestAnimationFrame(this.render.bind(this));
    }

    // 카메라 설정 함수
    _setupCamera() {
        // 컨테이너의 너비와 높이
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        
        // 원근 카메라를 생성
        const camera = new THREE.PerspectiveCamera(
            75,              // 시야각(FOV): 카메라가 보는 장면의 세로 각도 (75도)
            width / height,  // 종횡비(aspect ratio): 화면의 가로 세로 비율을 카메라에 맞추기 위해 설정
            0.1,             // near clipping plane: 이 거리보다 가까운 객체는 렌더링되지 않음
            100              // far clipping plane: 이 거리보다 먼 객체는 렌더링되지 않음
        );
        
        // 카메라의 위치를 설정합니다. z축 방향으로 2만큼 떨어져 위치
        camera.position.z = 2;
        
        // 생성된 카메라를 클래스의 속성으로 저장하여 다른 메서드에서도 접근
        this._camera = camera;
    }

    // 조명 설정 함수
    _setupLight() {
        const color = 0xffffff;          // 빛의 색상 설정 (흰색)
        const intensity = 1;             // 빛의 강도 설정 (1은 기본 강도)
        // THREE.DirectionalLight 태양과 같이 한 방향에서 특정한 방향으로 빛을 비추는 조명
        const light = new THREE.DirectionalLight(color, intensity);
        
        // 빛의 위치를 설정. x, y, z 축에 따라 방향을 지정합니다.
        light.position.set(-1, 2, 4);
    
        // 생성한 빛을 씬에 추가하여 적용
        this._scene.add(light);
    }

    // 모델 설정 함수 
    _setupModel() {
        // 큐브의 모양을 정의하는 형상(geometry) 설정
        const geometry = new THREE.BoxGeometry(1, 1, 1);
    
        // 큐브의 재질(material) 설정, 색상 지정
        const material = new THREE.MeshPhongMaterial({ color: 0xc72268 });
    
        // 형상과 재질을 결합하여 최종적으로 씬에 렌더링할 실제 3D 객체(mesh) 생성
        const cube = new THREE.Mesh(geometry, material);
    
        // 생성된 큐브를 씬(scene)에 추가하여 화면에 보이도록 설정
        this._scene.add(cube);
    
        // 나중에 접근할 수 있도록 this._cube에 큐브 저장
        this._cube = cube;
    }

    // 창 크기 조정 함수
    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._renderer.setSize(width, height); // 렌더러 크기 조정
        // 카메라의 종횡비 조정 및 갱신
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
    }

    // 렌더링 함수
    render(time) {
        // 씬을 카메라 시점으로 렌더링
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this)); // 다음 프레임을 렌더링하도록 설정
    }

    update(time) {
        time *= 0.001;
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }
}


// 페이지가 로드된 후 App 클래스의 인스턴스를 생성
window.onload = function () {
    new App();
}
