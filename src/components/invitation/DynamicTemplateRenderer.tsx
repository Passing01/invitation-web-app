"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TemplateConfig, TemplateElement, TemplatePage } from '@/lib/templates';
import { cn, formatDate } from '@/lib/utils';
import { RSVPForm } from './RSVPForm';
import { MapPin, Clock, Gift, Copy, Check } from 'lucide-react';
import { LaravelInvitationResponse } from '@/hooks/useInvitation';

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

    const renderElement = (element: TemplateElement) => {
        const commonStyles: React.CSSProperties = {
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: 'translate(-50%, -50%)',
            width: element.style.width ? `${element.style.width}%` : 'auto',
            zIndex: 10,
        };

        if (element.type === 'text') {
            let content = element.content || '';

            // Dynamic Mapping based on event_type
            switch (element.id) {
                case 'title': content = eventData.title; break;
                case 'host': content = eventData.host || eventData.title; break;
                case 'date': content = formatDate(eventData.event_date); break;
                case 'location':
                    const loc = eventData.location || (eventData.locations && eventData.locations[0]);
                    content = loc ? `${loc.name}\n${loc.address}` : '';
                    break;
                case 'dress_code': content = eventData.dress_code || ''; break;
                case 'hashtag': content = eventData.custom_data?.hashtag || ''; break;

                // Wedding specific
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
                case 'groom_name': content = eventData.groom_name || ''; break;
                case 'bride_name': content = eventData.bride_name || ''; break;

                // Birthday specific
                case 'celebrant_name': content = eventData.celebrant_name || ''; break;
                case 'age': content = eventData.age ? `${eventData.age} Ans` : ''; break;

                // Corporate specific
                case 'company_name': content = eventData.company_name || ''; break;
                case 'agenda':
                    if (Array.isArray(eventData.agenda)) {
                        content = eventData.agenda.join('\n');
                    } else {
                        content = eventData.agenda || '';
                    }
                    break;
            }

            return (
                <div
                    key={element.id}
                    style={{
                        ...commonStyles,
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
                    {content}
                </div>
            );
        }

        if (element.type === 'image') {
            const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400';
            const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400';

            let src = element.content || FALLBACK_PHOTO;

            // Mapping dynamic images based on ID and Event Type
            if (eventData.event_type === 'wedding') {
                if (element.id === 'photo' || element.id === 'couple_photo') {
                    // Two photos côte à côte if it's a wedding and we have both
                    return (
                        <div key={element.id} style={{ ...commonStyles, width: '90%', left: '50%' }} className="flex justify-center gap-4">
                            <div className="w-[45%] aspect-[3/4] rounded-full border-2 border-white/20 shadow-xl overflow-hidden bg-neutral-900">
                                <img
                                    src={eventData.groom_photo_url || FALLBACK_PHOTO}
                                    alt="Groom"
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                            </div>
                            <div className="w-[45%] aspect-[3/4] rounded-full border-2 border-white/20 shadow-xl overflow-hidden bg-neutral-900">
                                <img
                                    src={eventData.bride_photo_url || FALLBACK_PHOTO}
                                    alt="Bride"
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                            </div>
                        </div>
                    );
                }
                if (element.id === 'groom_photo') src = eventData.groom_photo_url || FALLBACK_PHOTO;
                if (element.id === 'bride_photo') src = eventData.bride_photo_url || FALLBACK_PHOTO;
            } else if (eventData.event_type === 'birthday') {
                if (element.id === 'photo' || element.id === 'celebrant_photo') {
                    src = eventData.celebrant_photo_url || FALLBACK_PHOTO;
                }
            } else if (eventData.event_type === 'corporate') {
                if (element.id === 'logo' || element.id === 'company_logo') {
                    src = eventData.company_logo_url || FALLBACK_LOGO;
                }
            }

            return (
                <div key={element.id} style={{ ...commonStyles, aspectRatio: eventData.event_type === 'corporate' ? 'auto' : '1/1', overflow: 'hidden' }} className={cn(
                    "border-2 border-white/20 shadow-xl bg-neutral-900",
                    eventData.event_type === 'corporate' ? "rounded-lg" : "rounded-full"
                )}>
                    <img src={src} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
            );
        }

        if (element.type === 'qrcode') {
            const qrSize = (element.style.width || 100) * scale * 2;
            return (
                <div key={element.id} style={commonStyles}>
                    <div className="bg-white p-2 rounded-lg inline-block shadow-lg">
                        <QRCodeSVG
                            value={`https://luxury-invitation.com/pass/${eventData.template_id}`} // Example
                            size={qrSize}
                            level="H"
                            fgColor="#1a1a1a"
                        />
                    </div>
                </div>
            );
        }

        if (element.type === 'rsvp-form') {
            const isLight = config.bgColor === '#ffffff' || config.bgColor === '#fffafb' || config.bgColor === '#f4e0c8' || config.bgColor === '#f0f4f8';
            return (
                <div key={element.id} style={commonStyles} className="w-full px-4">
                    <div className={cn(
                        "backdrop-blur-md p-6 border rounded-2xl shadow-xl",
                        isLight ? "bg-black/5 border-black/10 text-black" : "bg-white/5 border-white/10 text-white"
                    )}>
                        <RSVPForm
                            variant={isLight ? 'light' : 'dark'}
                            eventData={eventData}
                            onSubmit={(data) => console.log('RSVP:', data)}
                        />
                    </div>
                </div>
            );
        }

        if (element.type === 'countdown') {
            return (
                <div key={element.id} style={commonStyles} className="w-full">
                    <Countdown targetDate={eventData.event_date} color={config.accentColor} />
                </div>
            );
        }

        if (element.type === 'gift-list') {
            return (
                <div key={element.id} style={commonStyles} className="w-full px-4">
                    <GiftList iban={eventData.custom_data?.gift_list_iban as string} color={config.accentColor} />
                </div>
            );
        }

        if (element.type === 'map') {
            const loc = eventData.location || (eventData.locations && eventData.locations[0]);
            if (!loc) return null;

            return (
                <div key={element.id} style={commonStyles} className="w-full px-4">
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
                </div>
            );
        }

        return null;
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

            <div className={cn(
                "relative z-10 p-8 md:p-20 flex flex-col",
                page.id === 'dashboard' ? "min-h-screen h-[200%]" : "h-full" // Allow dashboard to be taller
            )}>
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
