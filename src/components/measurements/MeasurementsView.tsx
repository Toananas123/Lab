import React, { useState } from 'react';
import {
  Calendar,
  Scale,
  Plus,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkline } from '../ui/Sparkline';
import { StreamlineIcon } from '../ui/StreamlineIcon';
import { BottomSheet } from '../ui/BottomSheet';

interface MeasurementsViewProps {
  onBackToProgress?: () => void;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({ onBackToProgress }) => {
  const { measurements, addMeasurement, deleteMeasurement } = useWorkout();
  const { profile } = useAuth();
  const unit = profile?.unitSystem || 'metric';
  const weightUnit = unit === 'metric' ? 'kg' : 'lbs';
  const lengthUnit = unit === 'metric' ? 'cm' : 'in';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [thighs, setThighs] = useState<string>('');
  const [arms, setArms] = useState<string>('');
  const [chest, setChest] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [compareDateA, setCompareDateA] = useState<string>(measurements[1]?.id || '');
  const [compareDateB, setCompareDateB] = useState<string>(measurements[0]?.id || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMeasurement({
      date,
      weight: weight ? parseFloat(weight) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      thighs: thighs ? parseFloat(thighs) : undefined,
      arms: arms ? parseFloat(arms) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      notes: notes.trim() || undefined,
      unit,
    });

    setWeight('');
    setWaist('');
    setHips('');
    setThighs('');
    setArms('');
    setChest('');
    setNotes('');
    setShowAddForm(false);
  };

  const itemA = measurements.find((m) => m.id === compareDateA);
  const itemB = measurements.find((m) => m.id === compareDateB);

  const calculateDelta = (valA?: number, valB?: number) => {
    if (valA === undefined || valB === undefined) return null;
    const diff = Number((valB - valA).toFixed(1));
    return diff;
  };

  const hipsSeries =
    measurements.length >= 2
      ? measurements
          .slice(0, 6)
          .reverse()
          .map((m) => m.hips || 94)
      : [92, 93, 93.5, 94.5, 95];

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          {onBackToProgress && (
            <button
              onClick={onBackToProgress}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#831843] hover:text-[#3B0726] mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour au Suivi</span>
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl font-semibold font-display text-[#3B0726] tracking-tight flex items-center gap-2.5">
            <StreamlineIcon name="body" className="w-6 h-6 text-[#EC4899] shrink-0" />
            <span>Suivi des Mensurations</span>
          </h1>
          <p className="text-xs text-[#7A5267] font-medium">
            Mesures physiques corporelles, évolution et comparaison ({weightUnit} & {lengthUnit})
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 px-5 py-3 text-xs font-bold text-white bg-[#831843] hover:bg-[#3B0726] rounded-full transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle prise de mesures</span>
        </button>
      </div>

      {/* Add Measurement BottomSheet */}
      <BottomSheet
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Enregistrer mes mesures du jour"
        subtitle="Renseigne les zones que tu souhaites suivre"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-[#831843] uppercase mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Poids ({weightUnit})
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="ex: 58.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Taille ({lengthUnit})
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="ex: 64"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Hanches ({lengthUnit})
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="ex: 94"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Cuisses ({lengthUnit})
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="ex: 54"
                value={thighs}
                onChange={(e) => setThighs(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Bras ({lengthUnit})
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="ex: 27"
                value={arms}
                onChange={(e) => setArms(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726] tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Poitrine ({lengthUnit})
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="ex: 86"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs font-mono font-bold text-[#3B0726] tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#7A5267] uppercase mb-1">
              Notes facultatives
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Prise le matin à jeun"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8] text-xs text-[#3B0726]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-full bg-[#FFF0F5] text-[#3B0726] text-xs font-bold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#831843] hover:bg-[#3B0726] text-white text-xs font-bold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* Comparison Tool if at least 2 measurements exist */}
      {measurements.length >= 2 && (
        <div className="p-6 rounded-[28px] bg-white border border-[#FBCFE8] space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#EC4899] font-bold block">Évolution corporelle</span>
              <h3 className="font-bold text-[#3B0726] text-base font-display">
                Comparateur entre deux dates
              </h3>
            </div>
            <div className="w-40">
              <Sparkline data={hipsSeries} width={150} height={38} strokeColor="#831843" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Date initiale (A)
              </label>
              <select
                value={compareDateA}
                onChange={(e) => setCompareDateA(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-[#FBCFE8] bg-[#FFF0F5] text-[#3B0726] text-xs font-bold tabular-nums"
              >
                {measurements.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.date}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#7A5267] uppercase mb-1">
                Date récente (B)
              </label>
              <select
                value={compareDateB}
                onChange={(e) => setCompareDateB(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-[#FBCFE8] bg-[#FFF0F5] text-[#3B0726] text-xs font-bold tabular-nums"
              >
                {measurements.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.date}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {itemA && itemB && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
              {[
                { label: 'Poids', valA: itemA.weight, valB: itemB.weight, u: weightUnit },
                { label: 'Taille', valA: itemA.waist, valB: itemB.waist, u: lengthUnit },
                { label: 'Hanches', valA: itemA.hips, valB: itemB.hips, u: lengthUnit },
                { label: 'Cuisses', valA: itemA.thighs, valB: itemB.thighs, u: lengthUnit },
                { label: 'Bras', valA: itemA.arms, valB: itemB.arms, u: lengthUnit },
                { label: 'Poitrine', valA: itemA.chest, valB: itemB.chest, u: lengthUnit },
              ].map((metric) => {
                const delta = calculateDelta(metric.valA, metric.valB);
                return (
                  <div key={metric.label} className="p-3 rounded-2xl bg-[#FFF0F5] border border-[#FBCFE8]/60 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#7A5267] block">
                      {metric.label}
                    </span>
                    <span className="font-display font-bold text-[#3B0726] text-lg tabular-nums block mt-0.5">
                      {metric.valB !== undefined ? `${metric.valB}` : '-'}
                    </span>
                    {delta !== null ? (
                      <span className="text-[10px] font-mono font-bold text-[#831843] tabular-nums">
                        {delta > 0 ? `+${delta}` : delta} {metric.u}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#7A5267]">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* History List */}
      <div className="space-y-3">
        <h3 className="font-bold font-display text-[#3B0726] text-sm pl-1">
          Historique chronologique
        </h3>

        {measurements.length === 0 ? (
          <div className="p-8 rounded-[28px] bg-white border border-[#FBCFE8] text-center space-y-2">
            <Scale className="w-8 h-8 text-[#EC4899] mx-auto" />
            <h4 className="font-bold font-display text-[#3B0726] text-base">
              Aucune mesure pour l'instant
            </h4>
            <p className="text-xs text-[#7A5267] max-w-sm mx-auto">
              Prends tes mensurations de départ pour suivre l'évolution de ta silhouette dans le temps.
            </p>
          </div>
        ) : (
          measurements.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-[28px] bg-white border border-[#FBCFE8] space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#FBCFE8]/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#EC4899]" />
                  <span className="font-bold text-[#3B0726] text-xs font-mono tabular-nums">
                    {m.date}
                  </span>
                  {m.notes && <span className="text-xs text-[#7A5267]">· {m.notes}</span>}
                </div>
                <button
                  onClick={() => deleteMeasurement(m.id)}
                  className="p-1.5 text-[#7A5267] hover:text-red-600 rounded-full hover:bg-[#FFF0F5]"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-xs">
                {m.weight !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-[#FFF0F5]">
                    <span className="text-[10px] font-bold text-[#7A5267] block uppercase">Poids</span>
                    <span className="font-display text-lg font-bold text-[#3B0726] tabular-nums">
                      {m.weight} <span className="text-[10px] font-sans">{weightUnit}</span>
                    </span>
                  </div>
                )}
                {m.waist !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-[#FFF0F5]">
                    <span className="text-[10px] font-bold text-[#7A5267] block uppercase">Taille</span>
                    <span className="font-display text-lg font-bold text-[#3B0726] tabular-nums">
                      {m.waist} <span className="text-[10px] font-sans">{lengthUnit}</span>
                    </span>
                  </div>
                )}
                {m.hips !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-[#FFF0F5]">
                    <span className="text-[10px] font-bold text-[#7A5267] block uppercase">Hanches</span>
                    <span className="font-display text-lg font-bold text-[#3B0726] tabular-nums">
                      {m.hips} <span className="text-[10px] font-sans">{lengthUnit}</span>
                    </span>
                  </div>
                )}
                {m.thighs !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-[#FFF0F5]">
                    <span className="text-[10px] font-bold text-[#7A5267] block uppercase">Cuisses</span>
                    <span className="font-display text-lg font-bold text-[#3B0726] tabular-nums">
                      {m.thighs} <span className="text-[10px] font-sans">{lengthUnit}</span>
                    </span>
                  </div>
                )}
                {m.arms !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-[#FFF0F5]">
                    <span className="text-[10px] font-bold text-[#7A5267] block uppercase">Bras</span>
                    <span className="font-display text-lg font-bold text-[#3B0726] tabular-nums">
                      {m.arms} <span className="text-[10px] font-sans">{lengthUnit}</span>
                    </span>
                  </div>
                )}
                {m.chest !== undefined && (
                  <div className="p-2.5 rounded-2xl bg-[#FFF0F5]">
                    <span className="text-[10px] font-bold text-[#7A5267] block uppercase">Poitrine</span>
                    <span className="font-display text-lg font-bold text-[#3B0726] tabular-nums">
                      {m.chest} <span className="text-[10px] font-sans">{lengthUnit}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
