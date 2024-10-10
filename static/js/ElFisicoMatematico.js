async function loadHoras() {
  const response = await fetch("templates/horas.json");
  const dt = await response.json();
  const dplan = dt[0];
  document.querySelector(".planes_horas_meses").innerHTML = `
              	<h2>PLANES POR HORAS</h2>
                <div class="contenido content-precios" id="id_contenido_planes">
                  <div class="class_cuadro_planes">
                    <h5 style="color: #8fe3ff; margin-left: 100px">NIVEL SUPERIOR</h5>
                    <p>Bachillerato</p>
                    <p>Nivelación - Senescyt - Prepo</p>
                    <div class="class_contenido_todo_informacion">
                      <div class="class_informacion_planes">
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/10h.png"
                            alt="10 horas"
                          />
                          <p><strong>${dplan["10b"]}usd</strong></p>
                          <p>Un solo pago</p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/20h.png"
                            alt="20 horas"
                          />
                          <p><strong>${dplan["20b"]}usd</strong></p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/30h.png"
                            alt="30 horas"
                          />
                          <p><strong>${dplan["30b"]}usd</strong></p>
                        </div>
                      </div>
                      <img
                        class="img_chicos_estudiando"
                        src="static/img/Fisico/cursos/estudiantes/nino_estudiando.png"
                        alt="mujer estudiando mate"
                      />
                    </div>
                  </div>

                  <div class="class_cuadro_planes">
                    <h5 style="color: #8fe3ff; margin-left: 100px">NIVEL AVANZADO</h5>
                    <p>Universidad</p>
                    <p>Grado - Posgrado</p>
                    <div class="class_contenido_todo_informacion">
                      <div class="class_informacion_planes">
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/10h.png"
                            alt="10 horas"
                          />
                          <p><strong>${dplan["10h"]}usd</strong></p>
                          <p>Un solo pago</p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/20h.png"
                            alt="20 horas"
                          />
                          <p><strong>${dplan["20h"]}usd</strong></p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/30h.png"
                            alt="30 horas"
                          />
                          <p><strong>${dplan["30h"]}usd</strong></p>
                        </div>
                      </div>
                      <img
                        class="img_chicos_estudiando"
                        src="static/img/Fisico/cursos/estudiantes/joven_estudiando.png"
                        alt="mujer estudiando mate"
                      />
                    </div>
                  </div>
                </div>

                <h2>PLANES MENSUALES</h2>
                <div class="contenido content-precios" id="id_contenido_planes">
                  <div class="class_cuadro_planes">
                    <h5 style="color: #8fe3ff; margin-left: 100px">NIVEL BÁSICO / SUPERIOR</h5>
                    <p>Escuela - Nivel Básico</p>
                    <p>Bachillerato - Nivelación - Senescyt - Prepo</p>
                    <div class="class_contenido_todo_informacion">
                      <div class="class_informacion_planes">
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/12h.png"
                            alt="12 horas"
                          />
                          <p><strong>${dplan["12b"]}usd</strong></p>
                          <p style="font-family: 'Playfair Display', serif;">Un solo pago</p>
                          <p>3 dias a la semana</p>
                          <p>1 hora por día</p>
                          <p><i>Plan por 1 mes</i></p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/24h.png"
                            alt="24 horas"
                          />
                          <p><strong>${dplan["24b"]}usd</strong></p>
                          <p>3 dias a la semana</p>
                          <p>2 hora por día</p>
                          <p><i>Plan por 1 mes</i></p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/40h.png"
                            alt="40 horas"
                          />
                          <p><strong>${dplan["40b"]}usd</strong></p>
                          <p>5 dias a la semana</p>
                          <p>2 hora por día</p>
                          <p><i>Plan por 1 mes</i></p>
                        </div>
                      </div>
                      <img
                        class="img_chicos_estudiando"
                        src="static/img/Fisico/cursos/estudiantes/nino_estudiando.png"
                        alt="mujer estudiando mate"
                      />
                    </div>
                  </div>

                  <div class="class_cuadro_planes">
                    <h5 style="color: #8fe3ff; margin-left: 100px">NIVEL AVANZADO</h5>
                    <p>Universidad</p>
                    <p>Grado - Posgrado</p>
                    <div class="class_contenido_todo_informacion">
                      <div class="class_informacion_planes">
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/12h.png"
                            alt="12 horas"
                          />
                          <p><strong> ${dplan["12h"]}usd </strong></p>
                          <p style="font-family: 'Playfair Display', serif;">Un solo pago</p>
                          <p>3 dias a la semana</p>
                          <p>1 hora por día</p>
                          <p><i>Plan por 1 mes</i></p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/24h.png"
                            alt="24 horas"
                          />
                          <p><strong>${dplan["24h"]}usd</strong></p>
                          <p>3 dias a la semana</p>
                          <p>2 hora por día</p>
                          <p><i>Plan por 1 mes</i></p>
                        </div>
                        <div class="class_infos">
                          <img
                            class="img_horas"
                            src="static/img/Fisico/cursos/horas/40h.png"
                            alt="40 horas"
                          />
                          <p><strong>${dplan["40h"]}usd</strong></p>
                          <p>5 dias a la semana</p>
                          <p>2 hora por día</p>
                          <p><i>Plan por 1 mes</i></p>
                        </div>
                      </div>
                      <img
                        class="img_chicos_estudiando"
                        src="static/img/Fisico/cursos/estudiantes/joven_estudiando.png"
                        alt="mujer estudiando mate"
                      />
                    </div>
                  </div>
                </div>
            
            `;

}

loadHoras();
