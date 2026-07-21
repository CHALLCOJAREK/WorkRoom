import os
import shutil
import string
import psutil
import time

# ================================================================
#   USB COPY WIZARD — FÉNIX EDITION ⚡
#   - Detecta USBs automáticamente
#   - Te deja elegir origen/destino
#   - Copia TODO el contenido con estilo futurista
# ================================================================

def banner(msg):
    print("\n" + "═" * 70)
    print(f"🚀 {msg}")
    print("═" * 70 + "\n")

def info(msg):
    print(f"🔹 {msg}")

def ok(msg):
    print(f"🟢 {msg}")

def warn(msg):
    print(f"⚠️ {msg}")

def error(msg):
    print(f"❌ {msg}")

# ------------------------------------------------
#   DETECTAR UNIDADES USB
# ------------------------------------------------
def detectar_usbs():
    unidades = []
    for part in psutil.disk_partitions():
        if "removable" in part.opts or part.fstype != "":
            unidades.append(part.device)
    return unidades

# ------------------------------------------------
#   MOSTRAR CONTENIDO COPIA EN VIVO
# ------------------------------------------------
def copiar_con_estilo(origen, destino):
    banner("Iniciando la transferencia de datos...")

    for root, dirs, files in os.walk(origen):
        ruta_destino = os.path.join(destino, os.path.relpath(root, origen))
        os.makedirs(ruta_destino, exist_ok=True)

        for archivo in files:
            origen_archivo = os.path.join(root, archivo)
            destino_archivo = os.path.join(ruta_destino, archivo)

            info(f"Copiando ➜ {archivo}")
            shutil.copy2(origen_archivo, destino_archivo)
            ok(f"  ✓ Transferido")

            time.sleep(0.05)

    ok("Transferencia completada con éxito.")
    banner("🎉 TODOS LOS ARCHIVOS HAN SIDO COPIADOS ✨")

# ------------------------------------------------
#   MAIN
# ------------------------------------------------
if __name__ == "__main__":
    banner("USB COPY WIZARD · Powered by Fénix 🜂")

    usbs = detectar_usbs()

    if not usbs:
        error("No se detectaron USBs. Conéctalas y vuelve a intentar.")
        exit()

    info("Unidades USB detectadas:")
    for i, unidad in enumerate(usbs):
        print(f"   [{i+1}] {unidad}")

    print("")
    opcion_origen = int(input("📥 Selecciona la unidad ORIGEN (número): "))
    opcion_destino = int(input("📤 Selecciona la unidad DESTINO (número): "))

    origen = usbs[opcion_origen - 1]
    destino = usbs[opcion_destino - 1]

    banner(f"📦 Preparando copia desde {origen} ➜ {destino}")

    copiar_con_estilo(origen, destino)
