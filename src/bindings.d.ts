import { Env } from 'hono';

export interface Bindings extends Env {
    HONO_TODO: KVNamespace;
}