'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    Video,
    Building2,
    DollarSign,
    Users
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

type MediaItem = {
    url: string;
    type: 'image' | 'video';
};

type SpaceFormData = {
    name: string;
    description: string;
    capacity: number;
    price_per_hour: number;
    image_url: string; // Keep as main/cover image
    media: MediaItem[];
};

export default function CreateSpacePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { register, control, handleSubmit, formState: { errors } } = useForm<SpaceFormData>({
        defaultValues: {
            name: '',
            description: '',
            capacity: 1,
            price_per_hour: 0,
            image_url: '',
            media: [{ url: '', type: 'image' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'media'
    });

    // Verify Admin Access
    useEffect(() => {
        const userRole = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')!).role
            : null;

        if (userRole !== 'admin') {
            toast.error('Acceso no autorizado');
            router.push('/dashboard');
        }
    }, [router]);

    const onSubmit = async (data: SpaceFormData) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Filter out empty media URLs
            const cleanMedia = data.media.filter(m => m.url.trim() !== '');

            const payload = {
                ...data,
                media: cleanMedia
            };

            await axios.post('http://localhost:3002/rooms', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Espacio creado exitosamente');
            router.push('/dashboard'); // Or back to list
        } catch (error) {
            console.error('Error creating space:', error);
            toast.error('Error al crear el espacio');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-950">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nuevo Espacio de Trabajo</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
                            <Building2 className="h-5 w-5 text-blue-500" />
                            Información Básica
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Nombre del Espacio
                                </label>
                                <input
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-white"
                                    placeholder="Ej. Sala de Juntas Ejecutiva"
                                />
                                {errors.name && <span className="mt-1 text-xs text-red-500">{errors.name.message}</span>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Descripción
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-white"
                                    placeholder="Describe las características y amenidades..."
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <span className="flex items-center gap-2"><Users className="h-4 w-4" /> Capacidad (personas)</span>
                                </label>
                                <input
                                    type="number"
                                    {...register('capacity', { valueAsNumber: true, min: 1 })}
                                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <span className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Precio por Hora (Bs.)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price_per_hour', { valueAsNumber: true, min: 0 })}
                                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-white"
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* Media */}
                    <section className="space-y-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-200">
                            <ImageIcon className="h-5 w-5 text-purple-500" />
                            Multimedia
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Imagen Principal (Portada)
                                </label>
                                <input
                                    {...register('image_url', { required: 'La imagen principal es obligatoria' })}
                                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-white"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {errors.image_url && <span className="mt-1 text-xs text-red-500">{errors.image_url.message}</span>}
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Galería (Imágenes y Videos)
                                </label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3">
                                        <select
                                            {...register(`media.${index}.type`)}
                                            className="rounded-lg border border-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:text-white"
                                        >
                                            <option value="image">Imagen</option>
                                            <option value="video">Video</option>
                                        </select>
                                        <input
                                            {...register(`media.${index}.url`)}
                                            className="flex-1 rounded-lg border border-slate-300 bg-transparent px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:text-white"
                                            placeholder={index === 0 ? "https://..." : "URL del recurso"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => append({ url: '', type: 'image' })}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar otro recurso
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            {loading ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Guardar Espacio
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
