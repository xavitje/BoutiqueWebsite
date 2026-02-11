'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FloatingNav } from '@/components/navigation/FloatingNav';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Mail, Calendar, Users as UsersIcon, MapPin, Euro, Clock, FileText, Upload, Download, Trash2, Edit2, Save, X, Plus } from 'lucide-react';
import Link from 'next/link';

interface JourneyData {
    id: string;
    travelStyle: string | null;
    destination: string | null;
    budget: string | null;
    duration: string | null;
    preferences: string | null;
    status: string;
    createdAt: Date;
    assignedTo: string | null;
    userName: string;
    userEmail: string;
    userId: string;
    assignedAdmin: { id: string; name: string; email: string } | null;
}

interface Note {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    adminId: string;
    adminName: string;
}

interface FileItem {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
    adminId: string;
    adminName: string;
}

export default function JourneyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();
    const [journey, setJourney] = useState<JourneyData | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Note states
    const [newNoteContent, setNewNoteContent] = useState('');
    const [addingNote, setAddingNote] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editNoteContent, setEditNoteContent] = useState('');

    // File upload states
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated' && params.id) {
            fetchJourneyDetails();
        }
    }, [status, params.id, router]);

    const fetchJourneyDetails = async () => {
        try {
            const response = await fetch(`/api/admin/journeys/${params.id}`);

            if (response.status === 403) {
                setError('Je hebt geen admin rechten.');
                setLoading(false);
                return;
            }

            if (response.status === 404) {
                setError('Reis niet gevonden.');
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const data = await response.json();
            setJourney(data.journey);
            setNotes(data.notes);
            setFiles(data.files);
        } catch (err) {
            setError('Kon reis details niet ophalen.');
        } finally {
            setLoading(false);
        }
    };

    const addNote = async () => {
        if (!newNoteContent.trim()) return;

        setAddingNote(true);
        try {
            const response = await fetch(`/api/admin/journeys/${params.id}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newNoteContent }),
            });

            if (response.ok) {
                setNewNoteContent('');
                await fetchJourneyDetails();
            }
        } catch (error) {
            alert('Kon notitie niet toevoegen.');
        } finally {
            setAddingNote(false);
        }
    };

    const startEditNote = (note: Note) => {
        setEditingNoteId(note.id);
        setEditNoteContent(note.content);
    };

    const saveEditNote = async (noteId: string) => {
        if (!editNoteContent.trim()) return;

        try {
            const response = await fetch(`/api/admin/journeys/${params.id}/notes/${noteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editNoteContent }),
            });

            if (response.ok) {
                setEditingNoteId(null);
                await fetchJourneyDetails();
            }
        } catch (error) {
            alert('Kon notitie niet updaten.');
        }
    };

    const deleteNote = async (noteId: string) => {
        if (!confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) return;

        try {
            const response = await fetch(`/api/admin/journeys/${params.id}/notes/${noteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchJourneyDetails();
            }
        } catch (error) {
            alert('Kon notitie niet verwijderen.');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/admin/journeys/${params.id}/files`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                await fetchJourneyDetails();
                e.target.value = '';
            } else {
                const error = await response.json();
                alert(error.error || 'Kon bestand niet uploaden.');
            }
        } catch (error) {
            alert('Kon bestand niet uploaden.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const deleteFile = async (fileId: string) => {
        if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) return;

        try {
            const response = await fetch(`/api/admin/journeys/${params.id}/files/${fileId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchJourneyDetails();
            }
        } catch (error) {
            alert('Kon bestand niet verwijderen.');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <>
                <main className="page-container section-padding">
                    <div className="text-center">
                        <p className="text-charcoal/60">Laden...</p>
                    </div>
                </main>
                <FloatingNav />
            </>
        );
    }

    if (error || !journey) {
        return (
            <>
                <main className="page-container section-padding">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl">Fout</h1>
                        <p className="text-charcoal/70">{error || 'Reis niet gevonden'}</p>
                        <Link href="/admin" className="btn-primary inline-block">
                            Terug naar admin panel
                        </Link>
                    </div>
                </main>
                <FloatingNav />
            </>
        );
    }

    return (
        <>
            <main className="page-container section-padding">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="text-4xl mb-1">Reis Details</h1>
                                <p className="text-charcoal/60 text-sm">
                                    Aangemaakt op {formatDate(journey.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Client Info */}
                            <div className="glass-effect p-6 rounded-sm">
                                <h2 className="text-2xl font-serif mb-4">Klant Informatie</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <UsersIcon size={20} className="text-gold" />
                                        <span className="font-medium">{journey.userName}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={20} className="text-gold" />
                                        <a href={`mailto:${journey.userEmail}`} className="text-gold hover:underline">
                                            {journey.userEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Journey Details */}
                            <div className="glass-effect p-6 rounded-sm">
                                <h2 className="text-2xl font-serif mb-4">Reis Details</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-charcoal/60 mb-1">Type Reis</p>
                                        <p className="font-medium">{journey.travelStyle || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal/60 mb-1">Bestemming</p>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gold" />
                                            <p className="font-medium">{journey.destination || '-'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal/60 mb-1">Budget</p>
                                        <div className="flex items-center gap-2">
                                            <Euro size={16} className="text-gold" />
                                            <p className="font-medium">{journey.budget || '-'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-charcoal/60 mb-1">Duur</p>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gold" />
                                            <p className="font-medium">{journey.duration || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                                {journey.preferences && (
                                    <div className="mt-4 pt-4 border-t border-charcoal/10">
                                        <p className="text-sm text-charcoal/60 mb-2">Voorkeuren & Opmerkingen</p>
                                        <p className="text-sm whitespace-pre-wrap">{journey.preferences}</p>
                                    </div>
                                )}
                            </div>

                            {/* Notes Section */}
                            <div className="glass-effect p-6 rounded-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-serif">Notities</h2>
                                    <span className="text-sm text-charcoal/60">{notes.length} notities</span>
                                </div>

                                {/* Add Note */}
                                <div className="mb-6">
                                    <textarea
                                        value={newNoteContent}
                                        onChange={(e) => setNewNoteContent(e.target.value)}
                                        placeholder="Voeg een notitie toe..."
                                        className="w-full p-3 border border-charcoal/20 rounded-sm resize-none focus:outline-none focus:border-gold transition-colors"
                                        rows={3}
                                    />
                                    <button
                                        onClick={addNote}
                                        disabled={!newNoteContent.trim() || addingNote}
                                        className="mt-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        {addingNote ? 'Toevoegen...' : 'Notitie Toevoegen'}
                                    </button>
                                </div>

                                {/* Notes List */}
                                <div className="space-y-4">
                                    {notes.length === 0 ? (
                                        <p className="text-center text-charcoal/60 py-8">Nog geen notities toegevoegd.</p>
                                    ) : (
                                        notes.map((note) => (
                                            <div key={note.id} className="p-4 bg-charcoal/5 rounded-sm">
                                                {editingNoteId === note.id ? (
                                                    <div>
                                                        <textarea
                                                            value={editNoteContent}
                                                            onChange={(e) => setEditNoteContent(e.target.value)}
                                                            className="w-full p-3 border border-charcoal/20 rounded-sm resize-none focus:outline-none focus:border-gold transition-colors mb-2"
                                                            rows={3}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => saveEditNote(note.id)}
                                                                className="px-3 py-1 bg-gold text-white rounded-sm text-sm flex items-center gap-1"
                                                            >
                                                                <Save size={14} />
                                                                Opslaan
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingNoteId(null)}
                                                                className="px-3 py-1 bg-charcoal/20 rounded-sm text-sm flex items-center gap-1"
                                                            >
                                                                <X size={14} />
                                                                Annuleren
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm whitespace-pre-wrap mb-3">{note.content}</p>
                                                        <div className="flex items-center justify-between text-xs text-charcoal/60">
                                                            <span>
                                                                {note.adminName} • {formatDate(note.createdAt)}
                                                                {note.updatedAt !== note.createdAt && ' (bewerkt)'}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => startEditNote(note)}
                                                                    className="text-gold hover:underline flex items-center gap-1"
                                                                >
                                                                    <Edit2 size={12} />
                                                                    Bewerken
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteNote(note.id)}
                                                                    className="text-red-600 hover:underline flex items-center gap-1"
                                                                >
                                                                    <Trash2 size={12} />
                                                                    Verwijderen
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Files Section */}
                            <div className="glass-effect p-6 rounded-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-serif">Bestanden</h2>
                                    <span className="text-sm text-charcoal/60">{files.length} bestanden</span>
                                </div>

                                {/* Upload */}
                                <div className="mb-6">
                                    <label className="block">
                                        <div className="border-2 border-dashed border-charcoal/20 rounded-sm p-8 text-center hover:border-gold transition-colors cursor-pointer">
                                            <Upload size={32} className="mx-auto mb-2 text-charcoal/40" />
                                            <p className="text-sm text-charcoal/60 mb-1">
                                                {uploading ? 'Uploaden...' : 'Klik om bestand te uploaden'}
                                            </p>
                                            <p className="text-xs text-charcoal/40">PDF, afbeeldingen, documenten (max 10MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx"
                                        />
                                    </label>
                                </div>

                                {/* Files List */}
                                <div className="space-y-3">
                                    {files.length === 0 ? (
                                        <p className="text-center text-charcoal/60 py-8">Nog geen bestanden geüpload.</p>
                                    ) : (
                                        files.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-4 bg-charcoal/5 rounded-sm">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <FileText size={20} className="text-gold flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium truncate">{file.filename}</p>
                                                        <p className="text-xs text-charcoal/60">
                                                            {formatFileSize(file.fileSize)} • {file.adminName} • {formatDate(file.uploadedAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <a
                                                        href={`/api/admin/journeys/${params.id}/files/${file.id}`}
                                                        download
                                                        className="p-2 hover:bg-charcoal/10 rounded-full transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => deleteFile(file.id)}
                                                        className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                        title="Verwijderen"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Status & Assignment */}
                        <div className="space-y-6">
                            <div className="glass-effect p-6 rounded-sm sticky top-24">
                                <h3 className="font-medium mb-4">Status & Toewijzing</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-charcoal/60 mb-2 block">Status</label>
                                        <span className={`px-3 py-2 rounded-full text-sm font-medium inline-block ${journey.status === 'pending'
                                                ? 'bg-gold/20 text-gold'
                                                : journey.status === 'reviewed'
                                                    ? 'bg-blue-500/20 text-blue-600'
                                                    : 'bg-green-500/20 text-green-600'
                                            }`}>
                                            {journey.status === 'pending' ? 'In afwachting' : journey.status === 'reviewed' ? 'Bekeken' : 'Gecontacteerd'}
                                        </span>
                                    </div>

                                    {journey.assignedAdmin && (
                                        <div>
                                            <label className="text-sm text-charcoal/60 mb-2 block">Toegewezen aan</label>
                                            <p className="font-medium">{journey.assignedAdmin.name}</p>
                                            <p className="text-sm text-charcoal/60">{journey.assignedAdmin.email}</p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-charcoal/10">
                                        <p className="text-xs text-charcoal/60">Reis ID</p>
                                        <p className="text-sm font-mono">{journey.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <FloatingNav />
        </>
    );
}
