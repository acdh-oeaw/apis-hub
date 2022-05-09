import type { ApisEntityType } from '@/features/apis/types'

export function sortEntityTypes(
  sourceEntityType: ApisEntityType,
  targetEntityType: ApisEntityType,
): [ApisEntityType, ApisEntityType] {
  if (shouldReverseRelation[sourceEntityType][targetEntityType]) {
    return [targetEntityType, sourceEntityType]
  }

  return [sourceEntityType, targetEntityType]
}

/**
 * Whether the relation type endpoint must be constructed in reverse.
 *
 * For example, from `Place` to `Event` results in `PlaceEvent`,
 * but from `Place` to `Person` results on `PersonPlace`.
 */
export const shouldReverseRelation: Record<ApisEntityType, Record<ApisEntityType, boolean>> = {
  Event: {
    Event: false,
    Institution: true,
    Person: true,
    Place: true,
    Work: false,
  },
  Institution: {
    Event: false,
    Institution: false,
    Person: true,
    Place: false,
    Work: false,
  },
  Person: {
    Event: false,
    Institution: false,
    Person: false,
    Place: false,
    Work: false,
  },
  Place: {
    Event: false,
    Institution: true,
    Person: true,
    Place: false,
    Work: false,
  },
  Work: {
    Event: true,
    Institution: true,
    Person: true,
    Place: true,
    Work: false,
  },
}
