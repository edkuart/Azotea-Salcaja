import { AdminCard } from "@/components/admin/AdminCard";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { TextAreaField } from "@/components/admin/TextAreaField";
import { TextField } from "@/components/admin/TextField";
import { adminRestaurantProfile } from "@/modules/admin/restaurant-data";

export default function AdminRestaurantPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        description="Gestiona la informacion general que aparece en la web publica y en SEO local."
        eyebrow="Restaurante"
        title="Informacion del restaurante"
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <AdminCard>
          <h2 className="text-lg font-semibold">Datos principales</h2>
          <form className="mt-5 grid gap-4">
            <TextField
              defaultValue={adminRestaurantProfile.name}
              label="Nombre"
            />
            <TextField
              defaultValue={adminRestaurantProfile.tagline}
              label="Frase corta"
            />
            <TextAreaField
              defaultValue={adminRestaurantProfile.description}
              label="Descripcion"
            />
            <TextField
              defaultValue={adminRestaurantProfile.address}
              label="Direccion"
            />
            <TextField
              defaultValue={adminRestaurantProfile.mapsUrl}
              label="Google Maps"
            />
            <button className="h-11 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800 sm:w-fit">
              Guardar informacion
            </button>
          </form>
        </AdminCard>

        <div className="grid gap-5">
          <AdminCard>
            <h2 className="text-lg font-semibold">Contacto y redes</h2>
            <form className="mt-5 grid gap-4">
              <TextField
                defaultValue={adminRestaurantProfile.phone}
                label="Telefono"
              />
              <TextField
                defaultValue={adminRestaurantProfile.whatsapp}
                label="WhatsApp"
              />
              <TextField
                defaultValue={adminRestaurantProfile.email}
                label="Correo"
              />
              <TextField
                defaultValue={adminRestaurantProfile.instagram}
                label="Instagram"
              />
              <TextField
                defaultValue={adminRestaurantProfile.facebook}
                label="Facebook"
              />
            </form>
          </AdminCard>

          <AdminCard>
            <h2 className="text-lg font-semibold">Horarios</h2>
            <div className="mt-5 grid gap-3">
              {adminRestaurantProfile.hours.map((hour) => (
                <div className="grid gap-3 sm:grid-cols-2" key={hour.day}>
                  <TextField defaultValue={hour.day} label="Dia" />
                  <TextField defaultValue={hour.time} label="Horario" />
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
