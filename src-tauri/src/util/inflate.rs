use bzip2::bufread::BzDecoder;
use flate2::read::GzDecoder;
use std::io::{Cursor, Read};
use xz2::read::XzDecoder;

/// Determine the type of compression used, and return an appropriate decoder
pub fn decompress_layer(layer: &[u8]) -> Result<Box<dyn Read + '_>, String> {
    const GZIP: &[u8] = b"\x1F\x8B";
    const BZIP2: &[u8] = b"\x42\x5A";
    const XZ: &[u8] = b"\xFD\x37";
    const ZIP: &[u8] = b"\x50\x4b";
    const ZZ: &[u8] = b"\x1f\x9d";

    match &layer[0..2] {
        ZIP => Ok(Box::from(Cursor::new(layer))),
        ZZ => Ok(Box::from(Cursor::new(layer))),
        GZIP => Ok(Box::from(GzDecoder::new(layer))),
        BZIP2 => Ok(Box::from(BzDecoder::new(layer))),
        XZ => Ok(Box::from(XzDecoder::new(layer))),
        _ => Ok(Box::from(Cursor::new(layer))),
    }
}
