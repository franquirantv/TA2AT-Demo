import { TRecurso } from "./TRecurso";
import { TLuz } from "./TLuz";
import { TRecursoShader } from './TRecursoShader';
import { mat4 } from 'gl-matrix';
import { TRecursoTextura } from './TRecursoTextura';


export class TRecursoMalla extends TRecurso{
  private vertices: number[];
  private normales: number[];
  private coordTexturas: [];
  private indices: number[];
  private vao: WebGLVertexArrayObject;
  private TRecursoShader: TRecursoShader;
  public override gl: WebGL2RenderingContext;
  private buffers: Array<WebGLBuffer>;
  private luz : TLuz;
  private nombreMalla: string;
  public textura: TRecursoTextura;
  private cont:number = 0;

  public constructor(shader: TRecursoShader, nombreMalla: string, textura: TRecursoTextura){
    super();
    this.luz = new TLuz();
    this.vertices = [];
    this.normales = new Array();
    this.coordTexturas = [];
    this.indices = new Array();
    var canvas = <HTMLCanvasElement>document.getElementById('glcanvas');
    this.gl = canvas.getContext('webgl2');
    this.vao = this.gl.createVertexArray();
    this.TRecursoShader = shader;
    this.buffers = new Array(3);
    this.nombreMalla = nombreMalla;
    this.textura = textura;
  }

  setTRecursoMalla(textura: TRecursoTextura){
    this.textura = textura;
  }

  override async cargarFichero(nombre: string){
    if(nombre != ''){
      var obj = this;
      // obj.setNombre(nombre);
      // console.log("AAAAAAAAAAAAAAAAAAAAAAAA: ",nombre)

      await fetch(nombre).then(function (res){
        res.json().then(function (datos){
          obj.vertices = datos.meshes[0].vertices;
          obj.normales = datos.meshes[0].normals;
          obj.coordTexturas = datos.meshes[0].texturecoords;
          // console.log("Coord tex: ",obj.coordTexturas)
          for(var i = 0; i < datos.meshes[0].faces.length; i++){
            for(var j = 0; j < datos.meshes[0].faces[i].length; j++)
              obj.indices.push(datos.meshes[0].faces[i][j]);
          }

          obj.setup();
        });
      });
    }
  }

  setup(){
    //Crear y enlazar el VAO
    this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    //Creay y enlazar Vertex Buffer Object (VBO) y Element Buffer Object (EBO)
    this.buffers[0] = this.gl.createBuffer();
    this.buffers[1] = this.gl.createBuffer();
    this.buffers[2] = this.gl.createBuffer();
    this.buffers[3] = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[0]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    var coord = this.gl.getAttribLocation(this.TRecursoShader.getProgramId(), 'position');
    this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(coord);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[1]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normales), this.gl.STATIC_DRAW);
    var _normal = this.gl.getAttribLocation(this.TRecursoShader.getProgramId(), 'a_normal');
    this.gl.vertexAttribPointer(_normal, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(_normal);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[2]);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[3]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.coordTexturas), this.gl.STATIC_DRAW);
    var _textCord = this.gl.getAttribLocation(this.TRecursoShader.getProgramId(), 'textCoord');
    this.gl.vertexAttribPointer(_textCord, 2, this.gl.FLOAT, true, 0, 0);
    this.gl.enableVertexAttribArray(_textCord);
  }

  dibujar(mat: mat4){

    this.textura.cargarTextura();
    //Uniforms
    //Localizar las variables y obtener su índice
    var locationPmatrix = this.gl.getUniformLocation(this.TRecursoShader.getProgramId(), "Pmatrix");
    var locationVmatrix = this.gl.getUniformLocation(this.TRecursoShader.getProgramId(), "Vmatrix");
    var locationMmatrix = this.gl.getUniformLocation(this.TRecursoShader.getProgramId(), "Mmatrix");
    var reverseLightDirectionLocation = this.gl.getUniformLocation(this.TRecursoShader.getProgramId(), "u_reverseLightDirection");
    var textCoordLocation = this.gl.getUniformLocation(this.TRecursoShader.getProgramId(), "diffuseTexture");

  // gl.uniform1iv(gl.getUniformLocation(shaderProgram, 'uTextures'), textureLocations);
  //gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uNumTextures'), numTextures);
    // console.log("TIENEEE:",this.gl.uniform1fv(this.gl.getUniformLocation(this.TRecursoShader.getProgramId(), 'uTextures'), this.textura.getLocaTextura()));
    //Si la localización es válida, asociar la variable con la matriz de datos
    if(locationPmatrix)
      this.gl.uniformMatrix4fv(locationPmatrix, false, this.TRecursoShader.getProjMatrix());
    if(locationVmatrix)
      this.gl.uniformMatrix4fv(locationVmatrix, false, this.TRecursoShader.getViewMatrix());
    if(locationMmatrix)
      this.gl.uniformMatrix4fv(locationMmatrix, false, mat);
    if(reverseLightDirectionLocation)
      this.gl.uniform3fv(reverseLightDirectionLocation, this.luz.getIntensidad());
    if(textCoordLocation)
      this.gl.uniform1i(textCoordLocation, 0);

    //Attributes
    //Asignar vertices 0 y 1 a los atributos vertexPosition y vertexNormal
    //Linkar al shader
    this.gl.bindAttribLocation(this.TRecursoShader.getProgramId(), 0, 'vertexPosition');
    this.gl.bindAttribLocation(this.TRecursoShader.getProgramId(), 1, 'vertexNormal');

    //Enlazar VAO
    this.gl.bindVertexArray(this.vao);

    //Dibujar
    this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
  }

}
