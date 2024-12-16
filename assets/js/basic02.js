// three.js 라이브러리를 '/three.js-master/build/three.module.js' 경로에서 가져오기
// 경로 연결 안 돼서 그냥 cdn 가져다 붙임 ㅠ
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OrbitControls } from "../../three.js-master/examples/jsm/controls/OrbitControls.js";

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
        this._setupControls();

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
        const intensity = 2;             // 빛의 강도 설정 (1은 기본 강도)
        // THREE.DirectionalLight 태양과 같이 한 방향에서 특정한 방향으로 빛을 비추는 조명
        const light = new THREE.DirectionalLight(color, intensity);

        // 빛의 위치를 설정. x, y, z 축에 따라 방향을 지정합니다.
        light.position.set(-1, 2, 4);

        // 생성한 빛을 씬에 추가하여 적용
        this._scene.add(light);
    }


    _setupControls() {
        // - this._camera 카메라 객체를 전달하여 사용자가 조작할 카메라를 지정
        // - this._divContainer DOM 요소를 전달하여 입력마우스(마우스, 터치)가 활성화될 컨테이너를 지정
        new OrbitControls(this._camera, this._divContainer);
    }

    // 모델 설정 함수 
    _setupModel() {
        // 1. 큐브 기하학 정의
        const geometry = new THREE.BoxGeometry(.5,1,1,2,2,2); 
        // - BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
        // - BoxGeometry(가로, 세로, 깊이, 가로세그먼트(큐브의 x축 방향을 나누는 격자 수), 세로세그먼트(큐브의 y축을 나누는 격자 수), 깊이세그먼트(큐브의 z축을 나누는 격자 수))
        // 가로, 세로, 깊이세그먼트를 2로 설정하여 각 면을 2X2 격자로 나눔
    
        // 2. 채우기 재질 생성
        const fillMasterial = new THREE.MeshPhongMaterial({color: 0X515151, emissive: 0x333333}); 
        // - MeshPhongMaterial: 광원을 받는 재질로, 반짝임과 입체감을 표현 가능
    
        // 3. 큐브 메쉬 생성 (기하학 + 재질)
        const cube = new THREE.Mesh(geometry, fillMasterial); 
        // - geometry와 fillMaterial을 사용하여 실제로 화면에 표시될 큐브 객체 생성
    
        // 4. 윤곽선(와이어프레임) 재질 생성
        const lineMaterial = new THREE.LineBasicMaterial({color: 0Xffff00}); 
        // - LineBasicMaterial: 단순한 선으로 구성된 재질
    
        // 5. 와이어프레임 생성
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), // 기하학을 윤곽선 형태로 변환
            lineMaterial                           // 윤곽선 재질 적용
        );
        // - WireframeGeometry: 주어진 geometry(큐브)를 윤곽선 형태로 변환
        // - LineSegments: 와이어프레임 형태를 선으로 그리는 객체
    
        // 6. 그룹 생성 및 큐브와 윤곽선 추가
        const group = new THREE.Group(); 
        group.add(cube); // 채우기 큐브 추가
        group.add(line); // 윤곽선 추가
        // - Group: 여러 객체를 하나의 그룹으로 묶어 논리적으로 관리 가능
    
        // 7. 장면(Scene)에 그룹 추가
        this._scene.add(group); 
        // - 그룹 전체를 Three.js의 장면에 추가하여 렌더링 대상이 되도록 설정
    
        // 8. 클래스 속성으로 그룹 저장
        this._cube = group; 
        // - 이후 다른 메서드에서 그룹을 제어하거나 접근할 수 있도록 속성에 저장
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

    // 렌더링 및 업데이트를 관리하는 클래스 내 함수
    render(time) {
        // 씬(Scene)을 카메라(Camera)의 시점으로 렌더링
        // - this._renderer: WebGLRenderer 인스턴스, Three.js의 렌더링 엔진
        // - this._scene: 3D 오브젝트들이 배치된 씬(Scene) 객체
        // - this._camera: 씬을 관찰하는 시점 역할을 하는 카메라 객체
        this._renderer.render(this._scene, this._camera);

        // 업데이트 함수 호출
        // - time: 브라우저의 requestAnimationFrame에서 전달하는 현재 시간 (밀리초 단위)
        this.update(time);

        // requestAnimationFrame을 사용해 다음 프레임을 예약
        // - render.bind(this): 현재 클래스 컨텍스트(this)를 유지하도록 bind 처리
        // - requestAnimationFrame은 화면의 새로고침 속도에 맞춰 호출
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        // 시간 값 변환 (밀리초 단위를 초 단위로 변환)
        // - time은 밀리초 단위로 전달되므로 0.001을 곱해 초 단위로 변경
        time *= 0.001;

        // 큐브 오브젝트(this._cube)의 X축 회전값 업데이트
        // - 시간이 지남에 따라 X축으로 회전
        //this._cube.rotation.x = time;

        // 큐브 오브젝트(this._cube)의 Y축 회전값 업데이트
        // - 시간이 지남에 따라 Y축으로 회전
        //this._cube.rotation.y = time;

        
    }
}


// 페이지가 로드된 후 App 클래스의 인스턴스를 생성
window.onload = function () {
    new App();
}
