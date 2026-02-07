"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TemplateConfig, TemplateElement, TemplatePage } from '@/lib/templates';
import { cn, formatDate } from '@/lib/utils';
import { RSVPForm } from './RSVPForm';
import { MapPin, Clock, Gift, Copy, Check, Star, Sparkles } from 'lucide-react';
import { LaravelInvitationResponse } from '@/hooks/useInvitation';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicTemplateRendererProps {
    page: TemplatePage;
    config: TemplateConfig;
    eventData: LaravelInvitationResponse;
    containerWidth: number;
}

function Countdown({ targetDate, color }: { targetDate: string, color: string }) {
    const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    React.useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const items = [
        { label: 'Jours', value: timeLeft.days },
        { label: 'Heures', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
    ];

    return (
        <div className="flex gap-4 justify-center py-6">
            {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-2xl font-serif" style={{ color }}>{item.value}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest mt-2 opacity-40">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

function GiftList({ iban, color }: { iban?: string, color: string }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (!iban) return;
        navigator.clipboard.writeText(iban);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
                <Gift size={20} style={{ color }} />
                <h3 className="font-serif text-lg">Contribution / Liste</h3>
            </div>
            <p className="text-sm opacity-60 mb-6 leading-relaxed">
                Votre présence est notre plus beau cadeau, mais si vous souhaitez nous témoigner une attention particulière...
            </p>
            {iban && (
                <div
                    onClick={handleCopy}
                    className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 cursor-pointer hover:bg-black/60 transition-all group"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-40 mb-1">IBAN de la liste</span>
                        <span className="text-xs font-mono tracking-wider truncate max-w-[200px]">{iban}</span>
                    </div>
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />}
                </div>
            )}
        </div>
    );
}

export function DynamicTemplateRenderer({
    page,
    config,
    eventData,
    containerWidth,
}: DynamicTemplateRendererProps) {
    const scale = containerWidth / 500;
    const isBirthday = config.id === 'sweet_sixteen';

    const renderElement = (element: TemplateElement) => {
        const commonStyles: React.CSSProperties = {
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: 'translate(-50%, -50%)',
            width: element.style.width ? `${element.style.width}%` : 'auto',
            zIndex: 10,
        };

        let content = element.content || '';
        const loc = eventData.location || (eventData.locations && eventData.locations[0]);

        if (element.type === 'text') {
            switch (element.id) {
                case 'title': content = eventData.title; break;
                case 'host': content = eventData.host || eventData.title; break;
                case 'date': content = formatDate(eventData.event_date); break;
                case 'location': content = loc ? `${loc.name}\n${loc.address}` : ''; break;
                case 'dress_code': content = eventData.dress_code || ''; break;
                case 'hashtag': content = eventData.custom_data?.hashtag || ''; break;
                case 'names':
                case 'couple_names':
                    if (eventData.event_type === 'wedding') {
                        content = `${eventData.groom_name || 'Mari'} & ${eventData.bride_name || 'Femme'}`;
                    } else if (eventData.event_type === 'birthday') {
                        content = eventData.celebrant_name || '';
                    } else if (eventData.event_type === 'corporate') {
                        content = eventData.company_name || '';
                    }
                    break;
                case 'celebrant_name':
                    content = (eventData.celebrant_name || 'DRIBBBLE').toUpperCase() + "'S";
                    break;
                case 'age':
                    content = eventData.age?.toString() || '16';
                    break;
                case 'date_text':
                    content = eventData.event_date ? new Date(eventData.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '6 AVRIL 2026';
                    break;
            }
        }

        return (
            <motion.div
                key={element.id}
                initial={isBirthday ? { scale: 0, opacity: 0, y: 50 } : { opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={isBirthday ? {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: (element.y / 100) * 0.5
                } : { duration: 0.8 }}
                style={commonStyles}
                className={cn(
                    isBirthday && "text-clay",
                    element.id === 'age' && isBirthday && "animate-float"
                )}
            >
                {element.type === 'text' && (
                    <div
                        style={{
                            fontSize: `${(element.style.fontSize || 16) * scale}px`,
                            fontFamily: element.style.fontFamily,
                            fontWeight: element.style.fontWeight,
                            color: element.style.color,
                            textAlign: element.style.textAlign,
                            letterSpacing: element.style.letterSpacing,
                            textTransform: element.style.textTransform,
                            fontStyle: element.style.italic ? 'italic' : 'normal',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {element.id === 'basketball' ? (
                            <div className="animate-float">
                                <svg width={(element.style.fontSize || 40) * scale} height={(element.style.fontSize || 40) * scale} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-basketball">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M4.9 19.1C3.1 17.3 2 14.8 2 12c0-5.5 4.5-10 10-10 2.8 0 5.3 1.1 7.1 2.9" />
                                    <path d="M14.2 14.2c.4-.4.8-.9 1-1.4" />
                                    <path d="M14.2 14.2c-.4.4-.9.8-1.4 1" />
                                    <path d="M14.2 14.2c3.4 3.4 4.8 7.8 4.8 7.8" />
                                    <path d="M9.8 9.8c-.4.4-.8.9-1 1.4" />
                                    <path d="M9.8 9.8c.4-.4.9-.8 1.4-1" />
                                    <path d="M9.8 9.8c-3.4-3.4-4.8-7.8-4.8-7.8" />
                                </svg>
                            </div>
                        ) : (
                            content || (element.id === 'age' ? '16' : element.id === 'celebrant_name' ? 'VOTRE NOM' : '')
                        )}
                    </div>
                )}

                {element.type === 'image' && (
                    <div
                        style={{ aspectRatio: eventData.event_type === 'corporate' ? 'auto' : '1/1', overflow: 'hidden' }}
                        className={cn(
                            "border-2 border-white/20 shadow-xl bg-neutral-900",
                            eventData.event_type === 'corporate' ? "rounded-lg" : "rounded-full"
                        )}
                    >
                        <img
                            src={element.id === 'photo' || element.id === 'celebrant_photo' ? (eventData.celebrant_photo_url || '') : (element.content || '')}
                            alt=""
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />
                    </div>
                )}

                {element.type === 'qrcode' && (
                    <div className="bg-white p-2 rounded-lg inline-block shadow-lg">
                        <QRCodeSVG
                            value={`https://luxury-invitation.com/pass/${eventData.template_id}`}
                            size={(element.style.width || 100) * scale * 2}
                            level="H"
                            fgColor="#1a1a1a"
                        />
                    </div>
                )}

                {element.type === 'rsvp-form' && (
                    <div className={cn(
                        "backdrop-blur-md p-6 border rounded-2xl shadow-xl",
                        (config.bgColor === '#ffffff' || config.bgColor === '#fffafb' || config.bgColor === '#f4e0c8' || config.bgColor === '#f0f4f8')
                            ? "bg-black/5 border-black/10 text-black"
                            : "bg-white/5 border-white/10 text-white"
                    )}>
                        <RSVPForm
                            variant={(config.bgColor === '#ffffff' || config.bgColor === '#fffafb' || config.bgColor === '#f4e0c8' || config.bgColor === '#f0f4f8') ? 'light' : 'dark'}
                            eventData={eventData}
                            onSubmit={(data) => console.log('RSVP:', data)}
                        />
                    </div>
                )}

                {element.type === 'countdown' && (
                    <Countdown targetDate={eventData.event_date} color={config.accentColor} />
                )}

                {element.type === 'gift-list' && (
                    <GiftList iban={eventData.custom_data?.gift_list_iban as string} color={config.accentColor} />
                )}

                {element.type === 'map' && loc && (
                    <div
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank')}
                        className="aspect-video bg-neutral-800 rounded-xl overflow-hidden relative cursor-pointer group border border-white/10"
                    >
                        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=48.8688,2.3392&zoom=14&size=600x300&scale=2&maptype=roadmap&format=png&visual_refresh=true')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20 group-hover:bg-black/10 transition-colors">
                            <MapPin size={32} className="mb-2 text-red-500" />
                            <span className="text-xs uppercase tracking-widest font-serif">Ouvrir dans Maps</span>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const particles = React.useMemo(() => {
        if (!mounted) return [];
        return [...Array(20)].map((_, i) => ({
            id: i,
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            left: Math.random() * 100 + '%',
            delay: Math.random() * 10 + 's',
            duration: Math.random() * 10 + 10 + 's',
        }));
    }, [mounted]);

    return (
        <div
            className={cn(
                "relative overflow-hidden w-full transition-colors duration-1000",
                page.id === 'dashboard' ? "min-h-screen h-auto" : "h-full"
            )}
            style={{
                backgroundColor: page.bgColor || config.bgColor,
            }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{
                    backgroundImage: `url(${page.bgUrl || config.bgUrl || 'none'})`,
                    opacity: (page.bgUrl || config.bgUrl) ? 1 : 0
                }}
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />

            {/* Sakura Particles for story-like feel */}
            {mounted && (page.id.startsWith('story') || config.id === 'majestic_story') && page.id !== 'dashboard' && (
                <div className="absolute inset-0 pointer-events-none z-20">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="absolute bg-pink-200/40 rounded-full blur-[1px] animate-float-sakura"
                            style={{
                                width: p.width,
                                height: p.height,
                                left: p.left,
                                top: -20 + 'px',
                                animationDelay: p.delay,
                                animationDuration: p.duration,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Birthday Decorations for Sweet Sixteen */}
            {mounted && isBirthday && page.id === 'cover' && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <Star size={40} className="absolute top-[10%] left-[10%] text-yellow-400 opacity-60 animate-float" style={{ animationDelay: '0s' }} />
                    <Star size={30} className="absolute top-[20%] right-[15%] text-pink-400 opacity-60 animate-float" style={{ animationDelay: '1s' }} />
                    <Sparkles size={35} className="absolute bottom-[20%] left-[15%] text-blue-400 opacity-60 animate-float" style={{ animationDelay: '2s' }} />
                    <Star size={25} className="absolute bottom-[10%] right-[10%] text-yellow-300 opacity-60 animate-float" style={{ animationDelay: '3s' }} />
                    <div className="absolute top-[40%] left-[5%] w-8 h-8 rounded-full bg-pink-300 opacity-40 blur-sm animate-float" />
                    <div className="absolute top-[60%] right-[5%] w-12 h-12 rounded-lg bg-blue-300 opacity-30 blur-sm rotate-12 animate-float" />
                </div>
            )}

            <div className={cn(
                "relative z-10 flex flex-col",
                isBirthday ? "h-[90%] w-[90%] m-auto rounded-[40px] shadow-2xl p-6 overflow-hidden" : (page.id === 'dashboard' ? "min-h-screen h-[200%] p-8 md:p-20" : "h-full p-8 md:p-20")
            )}
                style={isBirthday ? {
                    backgroundColor: 'white',
                    backgroundImage: `url(${eventData.celebrant_photo_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                } : {}}>
                {isBirthday && (
                    <>
                        {/* Semi-transparent overlay to keep text readable */}
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-0" />
                        <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-400 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
                        </div>
                    </>
                )}
                {page.elements.map(renderElement)}
            </div>

            <style jsx>{`
                @keyframes floatSakura {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .animate-float-sakura {
                    animation: floatSakura linear infinite;
                }
            `}</style>
            <link
                rel="stylesheet"
                href={`https://fonts.googleapis.com/css2?family=${config.fonts.join('&family=')}&display=swap`}
            />
        </div>
    );
}
