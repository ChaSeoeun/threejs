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
        // const geometry = new THREE.CircleGeometry(0.4, 16, Math.PI/2, Math.PI);
        // - 원모양의 기하를 생성 CircleGeometry(radius, segments, thetaStart, thetaLength)
        // - CircleGeometry(원의 크기, 원 둘레를 따라 생성되는 삼각형의 개수(값이 높을 수록 원이 더 부드러워짐), 원이 시작되는 위치를 라디안 단위로 지정, 원의 길이(부채꼴 범위)를 라디안 단위로 지정)

        // const geometry = new THREE.ConeGeometry(.5, 1.6, 16, 9, true, 0, Math.PI);
        // - 원뿔 모양의 기하를 생성 ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
        // - ConeGeometry(원뿔의 밑면 크기를 결정, 밑면에서 꼭지점까지의 거리(=원뿔의 높이), 원뿔 밑면의 둘레를 따라 생성되는 삼각형 개수(값이 클 수록 부드러워짐), true로 설정시 밑면이 없는 열린 원뿔 생성, 원뿔 밑면에서 시작하는 각도를 라디안 단위로 지정, 원뿔 밑면을 따라 생성될 각 길이를 라디안 단위로 지정)

        // const geometry = new THREE.CylinderGeometry(.9, .9, 1.6, 32, 12, true);
        // - 원기둥 모양의 기하를 생성 CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
        // - CylinderGeometry(원기둥 위쪽 끝면 반지름, 원기둥 아래쪽 끝면 반지름, 원기둥 둘레를 따라 생성되는 삼각형 개수, 원기둥 높이를 따라 생성되는 세그먼트 개수, 열림 여부, 원기둥 밑면에서 시작하는 각도를 라디안 단위로 지정, 밑면의 둘레를 따라 생성될 각 길이를 라디안 단위로 지정)

        // const geometry = new THREE.SphereGeometry(.9, 32, 42, 0, Math.PI, 0, Math.PI/2);
        // - 구체 모양의 기하를 생성 SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
        // - SphereGeometry(구체의 크기, 구체의 위도 방향에 따라 생성될 세그먼트 수, 구체의 경도 방향에 따라 생성될 세그먼트 수, 구체의 위도 방향에서 시작하는 각도, 위도 방향에서 생성될 각 길이, 경도 방향에서 시작하는 각도, 경도 방향에서 생성될 각 길이)

        // const geometry = new THREE.RingGeometry(.7, .3, 32, 9);
        // - 평면 상의 링(고리) 모양의 기하를 생성 RingGeometry(innerRadius, outerRadius, thetaSegments phiSegments, thetaStart, thetaLength)
        // RingGeometry(링의 내부 반지름(링 가운데 구멍의 크기 결정), 링 와부 반지름(전체 크기 결정), 링 둘레를 따라 나뉘는 세그먼트의 개수, 링의 폭을 따라 나뉘는 세그먼트의 개수, 링의 시작 각도, 링이 차지하는 각도(길이))

        // const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
        // - 평면 상의 사각형 모양의 기하를 생성 PlaneGeometry(width, height, widthSegments, heightSegments)
        // GIS(지리정보 시스템)에서 3차원 지형 등을 표현하는데 유용하게 사용
        // - PlaneGeometry(평면의 너비, 평면의 높이, 평면의 너비를 따라 나뉘는 세그먼트의 개수, 평면의 높이를 따라 나뉘는 세그먼트의 개수)

        // const geometry = new THREE.TorusGeometry(1, .4, 24, 32);
        // - 원형 도형 모양의 3D 객체를 생성 TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
        // - TorusGeometry(중심 반지름, 튜브의 반지름(튜브 두께를 결정))
        // - TorusGeometry(도넛의 크기, 도넛 단면의 두께(도넛 단면이 얼마나 굵을지 결정), 토러스의 큰 원을 따라 생성되는 세그먼트의 수, 토러스가 얼마나 회전하여 만들어질지 설정)

        const geometry = new THREE.TorusKnotGeometry(.6, .1, 64, 32, 3, 4);
        // - 일반적인 토러스(도넛 모양)와 달리 복잡한 매듭 구조를 가진 3D 객체를 생성
        // TorusKnotGeometry(radius, tube, radialSegments, tubularSegments, p, q);
        // - TorusKnotGeometry(매듭 전체 크기를 조정, 매듭 단면의 두께를 정의, 매듭의 중심을 따라 배치된 세그먼트 수, 매듭이 중심을 기준으로 몇 번 꼬이는지를 정의, 매듭이 자체적으로 꼬이는 횟수)
        // - p: 매듭이 중심을 기준으로 "도는" 횟수 - q: 매듭이 자체적으로 "꼬이는" 횟수 ... 두 값은 정수여야 하며, 서로 다른 값을 가지면 매듭 모양이 나타남

    
        const fillMasterial = new THREE.MeshPhongMaterial({color: 0X515151});     
        const cube = new THREE.Mesh(geometry, fillMasterial);     
        const lineMaterial = new THREE.LineBasicMaterial({color: 0Xffff00}); 
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            lineMaterial 
        );
    
        const group = new THREE.Group(); 
        group.add(cube); 
        group.add(line);
    
        this._scene.add(group); 
        this._cube = group; 
    }

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
