import type { AbstractQueryGenerator } from './dialects/abstract/query-generator.js';
/**
 * Can be used to
 * make foreign key constraints deferrable and to set the constaints within a
 * transaction. This is only supported in PostgreSQL.
 *
 * The foreign keys can be configured like this. It will create a foreign key
 * that will check the constraints immediately when the data was inserted.
 *
 * ```js
 * class MyModel extends Model {}
 * MyModel.init({
 *   foreign_id: {
 *     type: DataTypes.INTEGER,
 *     references: {
 *       model: OtherModel,
 *       key: 'id',
 *       deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
 *     }
 *   }
 * }, { sequelize });
 * ```
 *
 * The constraints can be configured in a transaction like this. It will
 * trigger a query once the transaction has been started and set the constraints
 * to be checked at the very end of the transaction.
 *
 * ```js
 * sequelize.transaction({
 *   deferrable: Sequelize.Deferrable.SET_DEFERRED
 * });
 * ```
 */
export declare class Deferrable {
    static toString(queryGenerator: AbstractQueryGenerator): void;
    toString(queryGenerator: AbstractQueryGenerator): void;
    toSql(_queryGenerator: AbstractQueryGenerator): void;
    static readonly INITIALLY_DEFERRED: {
        new (): {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        };
        toString(queryGenerator: AbstractQueryGenerator): void;
        readonly INITIALLY_DEFERRED: any & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly INITIALLY_IMMEDIATE: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
         * it impossible to dynamically defer the constraints within a transaction.
         */
        readonly NOT: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to deferred.
         */
        readonly SET_DEFERRED: {
            new (constraints: string[]): {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#3@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to immediately.
         */
        readonly SET_IMMEDIATE: {
            new (constraints: string[]): {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#4@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
    } & (() => {
        toSql(): string;
        toString(queryGenerator: AbstractQueryGenerator): void;
    });
    static readonly INITIALLY_IMMEDIATE: {
        new (): {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        };
        toString(queryGenerator: AbstractQueryGenerator): void;
        readonly INITIALLY_DEFERRED: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly INITIALLY_IMMEDIATE: any & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
         * it impossible to dynamically defer the constraints within a transaction.
         */
        readonly NOT: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to deferred.
         */
        readonly SET_DEFERRED: {
            new (constraints: string[]): {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#3@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to immediately.
         */
        readonly SET_IMMEDIATE: {
            new (constraints: string[]): {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#4@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
    } & (() => {
        toSql(): string;
        toString(queryGenerator: AbstractQueryGenerator): void;
    });
    /**
     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
     * it impossible to dynamically defer the constraints within a transaction.
     */
    static readonly NOT: {
        new (): {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        };
        toString(queryGenerator: AbstractQueryGenerator): void;
        readonly INITIALLY_DEFERRED: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly INITIALLY_IMMEDIATE: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly NOT: any & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to deferred.
         */
        readonly SET_DEFERRED: {
            new (constraints: string[]): {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#3@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to immediately.
         */
        readonly SET_IMMEDIATE: {
            new (constraints: string[]): {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#4@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
    } & (() => {
        toSql(): string;
        toString(queryGenerator: AbstractQueryGenerator): void;
    });
    /**
     * Will trigger an additional query at the beginning of a
     * transaction which sets the constraints to deferred.
     */
    static readonly SET_DEFERRED: {
        new (constraints: string[]): {
            readonly "__#3@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        };
        toString(queryGenerator: AbstractQueryGenerator): void;
        readonly INITIALLY_DEFERRED: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly INITIALLY_IMMEDIATE: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
         * it impossible to dynamically defer the constraints within a transaction.
         */
        readonly NOT: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly SET_DEFERRED: any & ((constraints: string[]) => {
            readonly "__#3@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to immediately.
         */
        readonly SET_IMMEDIATE: {
            new (constraints: string[]): {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#4@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
    } & ((constraints: string[]) => {
        readonly "__#3@#constraints": string[];
        toSql(queryGenerator: AbstractQueryGenerator): string;
        toString(queryGenerator: AbstractQueryGenerator): void;
    });
    /**
     * Will trigger an additional query at the beginning of a
     * transaction which sets the constraints to immediately.
     */
    static readonly SET_IMMEDIATE: {
        new (constraints: string[]): {
            readonly "__#4@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        };
        toString(queryGenerator: AbstractQueryGenerator): void;
        readonly INITIALLY_DEFERRED: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly INITIALLY_IMMEDIATE: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: {
                new (): {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: {
                    new (constraints: string[]): {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to immediately.
                     */
                    readonly SET_IMMEDIATE: {
                        new (constraints: string[]): {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        };
                        toString(queryGenerator: AbstractQueryGenerator): void;
                        readonly INITIALLY_DEFERRED: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly INITIALLY_IMMEDIATE: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                         * it impossible to dynamically defer the constraints within a transaction.
                         */
                        readonly NOT: any & (() => {
                            toSql(): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        /**
                         * Will trigger an additional query at the beginning of a
                         * transaction which sets the constraints to deferred.
                         */
                        readonly SET_DEFERRED: any & ((constraints: string[]) => {
                            readonly "__#3@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                            readonly "__#4@#constraints": string[];
                            toSql(queryGenerator: AbstractQueryGenerator): string;
                            toString(queryGenerator: AbstractQueryGenerator): void;
                        });
                    } & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
         * it impossible to dynamically defer the constraints within a transaction.
         */
        readonly NOT: {
            new (): {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to deferred.
             */
            readonly SET_DEFERRED: {
                new (constraints: string[]): {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to immediately.
                 */
                readonly SET_IMMEDIATE: {
                    new (constraints: string[]): {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    };
                    toString(queryGenerator: AbstractQueryGenerator): void;
                    readonly INITIALLY_DEFERRED: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly INITIALLY_IMMEDIATE: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                     * it impossible to dynamically defer the constraints within a transaction.
                     */
                    readonly NOT: any & (() => {
                        toSql(): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    /**
                     * Will trigger an additional query at the beginning of a
                     * transaction which sets the constraints to deferred.
                     */
                    readonly SET_DEFERRED: any & ((constraints: string[]) => {
                        readonly "__#3@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                    readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                        readonly "__#4@#constraints": string[];
                        toSql(queryGenerator: AbstractQueryGenerator): string;
                        toString(queryGenerator: AbstractQueryGenerator): void;
                    });
                } & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & (() => {
            toSql(): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        /**
         * Will trigger an additional query at the beginning of a
         * transaction which sets the constraints to deferred.
         */
        readonly SET_DEFERRED: {
            new (constraints: string[]): {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            };
            toString(queryGenerator: AbstractQueryGenerator): void;
            readonly INITIALLY_DEFERRED: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly INITIALLY_IMMEDIATE: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
             * it impossible to dynamically defer the constraints within a transaction.
             */
            readonly NOT: any & (() => {
                toSql(): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            readonly SET_DEFERRED: any & ((constraints: string[]) => {
                readonly "__#3@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
            /**
             * Will trigger an additional query at the beginning of a
             * transaction which sets the constraints to immediately.
             */
            readonly SET_IMMEDIATE: {
                new (constraints: string[]): {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                };
                toString(queryGenerator: AbstractQueryGenerator): void;
                readonly INITIALLY_DEFERRED: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly INITIALLY_IMMEDIATE: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will set the constraints to not deferred. This is the default in PostgreSQL and it make
                 * it impossible to dynamically defer the constraints within a transaction.
                 */
                readonly NOT: any & (() => {
                    toSql(): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                /**
                 * Will trigger an additional query at the beginning of a
                 * transaction which sets the constraints to deferred.
                 */
                readonly SET_DEFERRED: any & ((constraints: string[]) => {
                    readonly "__#3@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
                readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
                    readonly "__#4@#constraints": string[];
                    toSql(queryGenerator: AbstractQueryGenerator): string;
                    toString(queryGenerator: AbstractQueryGenerator): void;
                });
            } & ((constraints: string[]) => {
                readonly "__#4@#constraints": string[];
                toSql(queryGenerator: AbstractQueryGenerator): string;
                toString(queryGenerator: AbstractQueryGenerator): void;
            });
        } & ((constraints: string[]) => {
            readonly "__#3@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
        readonly SET_IMMEDIATE: any & ((constraints: string[]) => {
            readonly "__#4@#constraints": string[];
            toSql(queryGenerator: AbstractQueryGenerator): string;
            toString(queryGenerator: AbstractQueryGenerator): void;
        });
    } & ((constraints: string[]) => {
        readonly "__#4@#constraints": string[];
        toSql(queryGenerator: AbstractQueryGenerator): string;
        toString(queryGenerator: AbstractQueryGenerator): void;
    });
}
