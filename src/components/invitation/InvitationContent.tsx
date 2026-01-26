"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface InvitationContentProps {
    data: {
        title: string;
        host: string;
        date: string;
        location: {
            name: string;
            address: string;
        };
        qrCodeData: string;
    };
}

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1 * i,
            duration: 1,
            ease: "easeOut",
        },
    }),
};

export function InvitationContent({ data }: InvitationContentProps) {
    return (
        <div className="min-h-screen bg-[#fdfaf5] text-neutral-900 pb-32">
            <section className="relative px-6 pt-24 max-w-2xl mx-auto text-center">
                <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-4"
                >
                    <span className="text-xs uppercase tracking-[0.4em] text-neutral-400 font-light">
                        {data.host} présente
                    </span>
                </motion.div>

                <motion.h1
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-5xl md:text-7xl font-serif tracking-tight mb-12"
                >
                    {data.title}
                </motion.h1>

                <motion.div
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="w-12 h-[1px] bg-neutral-300 mx-auto mb-12"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col items-center"
                    >
                        <Calendar className="mb-4 text-neutral-300" size={24} strokeWidth={1} />
                        <p className="text-lg font-serif">
                            {formatDate(data.date).split(' à ')[0]}
                        </p>
                    </motion.div>

                    <motion.div
                        custom={5}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col items-center"
                    >
                        <Clock className="mb-4 text-neutral-300" size={24} strokeWidth={1} />
                        <p className="text-lg font-serif">
                            {formatDate(data.date).split(' à ')[1]}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    custom={6}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-20"
                >
                    <MapPin className="mx-auto mb-4 text-neutral-300" size={24} strokeWidth={1} />
                    <h3 className="text-xl font-serif mb-2">{data.location.name}</h3>
                    <p className="text-neutral-500 text-sm max-w-xs mx-auto leading-relaxed uppercase tracking-wider">
                        {data.location.address}
                    </p>
                </motion.div>

                <motion.div
                    custom={7}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="p-12 border border-neutral-100 bg-white/50 inline-block"
                >
                    <div className="mb-6">
                        <QRCodeSVG
                            value={data.qrCodeData}
                            size={120}
                            level="H"
                            includeMargin={false}
                            fgColor="#1a1a1a"
                        />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                        Pass d'entrée individuel
                    </p>
                </motion.div>
            </section>

            {/* Decorative vertical line */}
            <div className="fixed left-6 top-0 bottom-0 w-[1px] bg-neutral-100 hidden lg:block" />
            <div className="fixed right-6 top-0 bottom-0 w-[1px] bg-neutral-100 hidden lg:block" />
        </div>
    );
}
