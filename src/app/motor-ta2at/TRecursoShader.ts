import { TRecurso } from "./TRecurso";
import { mat4 } from "gl-matrix";
import { TCamara } from "./TCamara";

export class TRecursoShader extends TRecurso{
  private programId: WebGLProgram;
  private vShaderId: WebGLShader;
  private fShaderId: WebGLShader;
  private vertCode: string;
  private fragCode: string;
  private projMatrix: mat4;
  private modelMatrix: mat4;
  private viewMatrix: mat4;
  private camara: TCamara;

  public constructor() {
    super();
    this.camara= new TCamara();
    this.camara.setProjMatrix(40, this.gl.canvas.width/this.gl.canvas.height, 1, 100);
    this.projMatrix= this.camara.getProjMatrix();
    this.modelMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.viewMatrix[14] = this.viewMatrix[14] - 5;

    this.vertCode =  `#version 300 es
    in vec3 position;
    in vec3 a_normal;
    in vec2 textCoord;
    uniform mat4 Pmatrix;
    uniform mat4 Vmatrix;
    uniform mat4 Mmatrix;
    out vec3 v_normal;
    out vec2 v_textCoord;
    void main(void){
      gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
      v_normal = mat3(inverse(transpose(Mmatrix))) * a_normal;
      v_textCoord = textCoord;
    }`;

    this.fragCode = `#version 300 es
    precision mediump float;
    in vec3 v_normal;
    in vec2 v_textCoord;
    uniform vec3 u_reverseLightDirection;
    uniform sampler2D diffuseTexture;
    layout(location = 0) out vec4 fragColor;
    void main(void) {
      vec3 normal = normalize(v_normal);
      float light = dot(normal, normalize(u_reverseLightDirection));
      fragColor = texture(diffuseTexture, v_textCoord);
      fragColor.rgb *= light;
    }
  `;

    this.setShaders();
  }

  setShaders(){
    this.vShaderId = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(this.vShaderId, this.vertCode);
    this.gl.compileShader(this.vShaderId);

    this.fShaderId = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.fShaderId, this.fragCode);
    this.gl.compileShader(this.fShaderId);

    this.programId = this.gl.createProgram();
    this.gl.attachShader(this.programId, this.vShaderId);
    this.gl.attachShader(this.programId, this.fShaderId);
    this.gl.linkProgram(this.programId);

    this.gl.deleteShader(this.vShaderId);
    this.gl.deleteShader(this.fShaderId);

    this.gl.useProgram(this.programId);

    if (!this.gl.getProgramParameter(this.programId, this.gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.programId));
      return null;
    }
  }

  getProgramId(): WebGLProgram{
    return this.programId;
  }

  setProjMatrix(matrix: mat4){
    this.projMatrix = matrix;
  }

  setModelMatrix(matrix: mat4){
    this.modelMatrix = matrix;
  }

  setViewMatrix(matrix: mat4){
    this.viewMatrix = matrix;
  }

  getProjMatrix(){
    return this.projMatrix;
  }

  getModelMatrix(){
    return this.modelMatrix;
  }

  getViewMatrix(){
    return this.viewMatrix;
  }

}
